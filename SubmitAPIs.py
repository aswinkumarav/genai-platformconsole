import os
import re
import json
import asyncio
import aiofiles
import subprocess
import aiohttp
from fastapi import FastAPI
from azure.cosmos.aio import CosmosClient
from azure.cosmos import PartitionKey
from azure.storage.blob.aio import BlobServiceClient
from azure.identity.aio import DefaultAzureCredential
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from azure.core.exceptions import ResourceNotFoundError, ResourceExistsError


app = FastAPI()
origins = ["http://localhost:3000","localhost:3000","http://icsanalyticsdev.nttdataservices.com:3000","icsanalyticsdev.nttdataservices.com:3000","http://155.16.36.111:3000","https://155.16.36.111:3000","http://localhost/ispal:80","http://localhost/ispal","http://136.226.253.94:8000/"]

@app.post("/createStorageContainer")
async def createStorageContainer(useCaseName: str):
    blob_service_client = BlobServiceClient(
        account_url="https://" + os.environ["StorageAccountName"] + ".blob.core.windows.net",
        credential=os.environ["StorageAccountKey"],
    )
    container_client = blob_service_client.get_container_client(
        container=useCaseName
    )
    try:
        await container_client.create_container()
        return 'Storage Container Created!'
    except Exception as e:
        return e
    
@app.post("/createCosmosDbContainer")
async def createCosmosContainer(useCaseName: str):
    client = CosmosClient(os.environ["CosmosURL"], os.environ["CosmosAPIKey"])
    database = client.get_database_client(os.environ["CosmosDataBaseName"])
    try:
        await database.create_container(
           id=useCaseName,
           partition_key=PartitionKey(path=os.environ["CosmosContainerPartitionKey"]),
           default_ttl=200
        )
        return 'Cosmos DB Container Created!'
    except Exception as e:
        return e

@app.post("/createSearchServiceIndex")
async def createSearchServiceIndex(useCaseName: str):
    url = f"https://{os.environ['AISearchServiceName']}.search.windows.net/indexes?api-version=2023-10-01-preview"
    Headers = {
        'Content-Type': 'application/json',
        'api-key': os.environ["AISearchServiceKey"],
        'Accept':'application/json'
        }
    body = {
        "name": useCaseName,
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
                if status_code == 200:
                    return 'Search Index Created!'
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
    workflowName = useCaseDetailsDict['useCaseDetails']['Name']
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
