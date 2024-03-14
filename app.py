import logging
import json
import os
import uuid
import aiohttp
from fastapi import FastAPI
from azure.identity.aio import DefaultAzureCredential
from backend.cosmosdbservice import CosmosQueryClient
from fastapi.middleware.cors import CORSMiddleware
from azure.cosmos.aio import CosmosClient
from azure.cosmos import PartitionKey
from azure.storage.blob.aio import BlobServiceClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
 
# Initialize Cosmos DB client
AZURE_COSMOSDB_ACCOUNT = "ae-dif-ai-cosmosdbnosql"
AZURE_COSMOSDB_DATABASE = "genai_dif_platform"
AZURE_COSMOSDB_QUERY_CONTAINER = "gdp_console_usecasedetails"
AZURE_COSMOSDB_ACCOUNT_KEY = "ANpot1uUowjCiTopMfsI7cc3F2qZjyWbVqFNqQxgmnEWYikUCN0d9QclLCV5D2HAs8pvBKAmExT7ACDbLb44PA=="


# Initialize a CosmosDB client for usecase with AAD auth
cosmos_query_client = None
if AZURE_COSMOSDB_DATABASE and AZURE_COSMOSDB_ACCOUNT and AZURE_COSMOSDB_QUERY_CONTAINER:
    try :
        cosmos_endpoint = f'https://{AZURE_COSMOSDB_ACCOUNT}.documents.azure.com:443/'
        print(cosmos_endpoint)
        credential = AZURE_COSMOSDB_ACCOUNT_KEY

        cosmos_query_client = CosmosQueryClient(
            cosmosdb_endpoint=cosmos_endpoint, 
            credential=credential, 
            database_name=AZURE_COSMOSDB_DATABASE,
            container_name=AZURE_COSMOSDB_QUERY_CONTAINER
        )
    except Exception as e:
        logging.exception("Exception in CosmosDB initialization", e)
        cosmos_query_client = None

@app.get("/useCase/list")
async def list_useCase(page):
    limit=20
    offset = (int(page) - 1) * limit
    result = cosmos_query_client.get_query(limit, offset)
    useCaseNames = cosmos_query_client.get_usecase_names_query()
    count = cosmos_query_client.get_count_query()
    
    # print(result)
    if not isinstance(result, list):
        return json.dumps({"error": f"No data found"}), 404

    response = { 'result': result,'total': count, 'useCaseNames': useCaseNames } 
    # print(response)
    return response
    
@app.post("/useCase/insert")
async def insertUseCase(data: dict):
    try:
        # make sure cosmos is configured
        if not cosmos_query_client:
            raise Exception("CosmosDB is not configured")
        print(data['messages'])
        if 'id' not in data['messages'] or data['messages']['id'] is None:
            print(1)
            maxId = cosmos_query_client.get_max_id()
            useCaseId = maxId + 1 if maxId is not None else 1 
            data['messages']['use_case_id'] = useCaseId
            data['messages']['id'] = str(uuid.uuid4())
            data['messages']['Frontend']['formData']['use_case_id'] = useCaseId
            data['messages']['Frontend']['formData']['id'] = data['messages']['id']
            cosmos_query_client.create_usecase(
                data['messages']
            )
        else:
            print(2)
            cosmos_query_client.update_usecase(
                data['messages']
            )

        response = {'success': True}
        return response, 200

    except Exception as e:
        logging.exception("Exception in /insert/usecases")
        return {"error": str(e)}
    
@app.delete("/useCase/delete")
async def deleteUseCase(id, use_case_id):
    try:
        if not cosmos_query_client:
            raise Exception("CosmosDB is not configured")

        print(id, use_case_id)
        cosmos_query_client.delete_query(id, use_case_id)

        response = {'success': True}
        return response, 200

    except Exception as e:
        logging.exception("Exception in /usecases/delete")
        return {"error": str(e)}

@app.post("/createStorageContainer")
async def createStorageContainer(useCaseName: dict):
    blob_service_client = BlobServiceClient(
        account_url="https://" + os.environ["StorageAccountName"] + ".blob.core.windows.net",
        credential=os.environ["StorageAccountKey"],
    )
    try:
        await blob_service_client.create_container(name=useCaseName['useCaseName'].lower())
        return {'Message : ','Storage Container Created!'}
    except Exception as e:
        return {'Exception':e}
    
@app.post("/createCosmosDbContainer")
async def createCosmosContainer(useCaseName: dict):
    client = CosmosClient(os.environ["CosmosURL"], os.environ["CosmosAPIKey"])
    database = client.get_database_client(os.environ["CosmosDataBaseName"])
    try:
        await database.create_container(
           id=useCaseName['useCaseName'].lower(),
           partition_key=PartitionKey(path=os.environ["CosmosContainerPartitionKey"]),
           default_ttl=200
        )
        return 'Cosmos DB Container Created!'
    except Exception as e:
        return e

@app.post("/createSearchServiceIndex")
async def createSearchServiceIndex(useCaseName: dict):
    url = f"https://{os.environ['AISearchServiceName']}.search.windows.net/indexes?api-version=2023-10-01-preview"
    Headers = {
        'Content-Type': 'application/json',
        'api-key': os.environ["AISearchServiceKey"],
        'Accept':'application/json'
        }
    body = {
        "name": useCaseName['useCaseName'].lower(),
        "fields": [
            {"name": "id", "type": "Edm.String", "searchable": "false","filterable": "true","retrievable": "true","sortable": "false","facetable": "false","key": "true","synonymMaps": []},
            {"name": "Keywords", "type": "Edm.String", "searchable": "true", "filterable": "false", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "analyzer": "standard.lucene", "synonymMaps": [] },
            {"name": "Content", "type": "Edm.String", "searchable": "true", "filterable": "false", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "synonymMaps": [] },
            {"name": "Source", "type": "Edm.String", "searchable": "true", "filterable": "true", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "analyzer": "standard.lucene", "synonymMaps": [] },
            {"name": "Headings", "type": "Edm.String", "searchable": "true", "filterable": "false", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "analyzer": "standard.lucene", "synonymMaps": [] },
            {"name": "FolderPath", "type": "Edm.String", "searchable": "true", "filterable": "true", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "analyzer": "standard.lucene", "synonymMaps": [] },
            {"name": "FullPath", "type": "Edm.String", "searchable": "true", "filterable": "true", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "analyzer": "standard.lucene", "synonymMaps": [] },
            {"name": "Embeddings", "type": "Collection(Edm.Single)", "searchable": "true", "filterable": "false", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "dimensions": 1536, "vectorSearchProfile": "vector-profile-hnsw-ada002-standard", "synonymMaps": [] },
            {"name": "HeadingsAndKeywords", "type": "Edm.String", "searchable": "true", "filterable": "false", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "analyzer": "standard.lucene", "synonymMaps": [] },
            {"name": "SharePointDownloadPath", "type": "Edm.String", "searchable": "false", "filterable": "false", "retrievable": "true", "sortable": "false", "facetable": "false", "key": "false", "synonymMaps": [] }
            ],
        "semantic": {
            "configurations": [
                {"name": "V1",
                 "prioritizedFields": {
                    "titleField": {"fieldName": "HeadingsAndKeywords"},
                    "prioritizedContentFields": [
                        {"fieldName": "Content"}
                        ],
                    "prioritizedKeywordsFields": [
                        {"fieldName": "Keywords"},
                        {"fieldName": "Headings"}, 
                        {"fieldName": "FullPath"}
                        ]
                    }
                }
            ]
        },
        "vectorSearch": {
            "algorithms": [
                {"name": "vector-config-hnsw-standard",
                "kind": "hnsw",
                "hnswParameters": {
                    "metric": "cosine",
                    "m": 10,
                    "efConstruction": 400,
                    "efSearch": 500
                    }
                }
            ],
            "profiles": [
                {"name": "vector-profile-hnsw-ada002-standard",
                "algorithm": "vector-config-hnsw-standard",
                "vectorizer": "vector-ada002-standard"
                }
            ],
            "vectorizers": [
                {"name": "vector-ada002-standard",
                "kind": "azureOpenAI",
                "azureOpenAIParameters": {
                    "resourceUri": f"https://{os.environ['ResourceGroupName']}.openai.azure.com",
                    "deploymentId": "TextEmbeddingAda002",
                    "apiKey": os.environ['OpenAIKey']
                    }
                }
            ]
        }
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url=url, headers=Headers, json=body) as res:
                status_code = res.status
                if status_code == 200 or status_code == 201:
                    return {'Message':'Search Index Created!'}
                else:
                    text = await res.text()
                    return {'Status':status_code ,'Message':text}             
    except Exception as e:
        return e

@app.post("/createLogicAppWorkflow")
async def createLogicAppWorkflow(useCaseDetailsDict: dict):
    credential = DefaultAzureCredential()
    tokenCredential = await credential.get_token("https://management.azure.com/.default")

    trigger = useCaseDetailsDict['Trigger']
    useCaseDetailsDict.pop('Trigger')
    body = {
        "location":"East US",
        "properties":{
            "definition": {
                "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
                "actions": {
                    "HTTP": {
                        "inputs": {
                            "body": useCaseDetailsDict,
                            "method": "POST",
                            "uri": "https://dummy.restapiexample.com/api/v1/create"
                        },
                        "runAfter": {},
                        "runtimeConfiguration": {
                            "contentTransfer": {
                                "transferMode": "Chunked"
                            }
                        },
                        "type": "Http"
                    }
                },
                "contentVersion": "1.0.0.0",
                "outputs": {},
                "triggers": {
                    "Trigger": trigger
                }
            }
        }
    }

    subscriptionId = os.environ["SubscriptionId"]
    resourceGroupName = os.environ["ResourceGroupName"]
    workflowName = useCaseDetailsDict['UseCaseDetails']['UseCaseName']
    url = f"https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}?api-version=2016-06-01"
   
    Headers = {
        'Authorization': 'Bearer ' + tokenCredential.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.put(url=url, headers=Headers, json=body) as res:
                status_code = res.status
                if status_code == 201:                    
                    return f'Workflow {workflowName} Created!'                    
                else:
                    text = await res.text()
                    return {'Status':status_code ,'Message':text}
    except Exception as e:
        return e