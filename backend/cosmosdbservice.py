import os
import uuid
from datetime import datetime
from azure.cosmos import CosmosClient  
  
class CosmosQueryClient():
    
    def __init__(self, cosmosdb_endpoint: str, credential: any, database_name: str, container_name: str):
        self.cosmosdb_endpoint = cosmosdb_endpoint
        self.credential = credential
        self.database_name = database_name
        self.container_name = container_name
        self.cosmosdb_client = CosmosClient(self.cosmosdb_endpoint, credential=credential)
        self.database_client = self.cosmosdb_client.get_database_client(database_name)
        self.container_client = self.database_client.get_container_client(container_name)
        print(self.container_client)

    def ensure(self):
        try:
            if not self.cosmosdb_client or not self.database_client or not self.container_client:
                return False
            
            container_info = self.container_client.read()
            if not container_info:
                return False
            
            return True
        except:
            return False
 
    def create_usecase(self, message):
        print(message, 'test')
        resp = self.container_client.create_item(message)  
        if resp:
            return resp
        else:
            return False

    def update_usecase(self, message):
        print(message, 'test')
        resp = self.container_client.upsert_item(message)  
        if resp:
            return resp
        else:
            return False
    
    def get_query(self, limit, offset):
        parameters = []
        query = f"SELECT * FROM c offset {offset} limit {limit}"
        result = list(self.container_client.query_items(query=query, parameters=parameters,
                                                                     enable_cross_partition_query =True))
        ## if no result are found, return false
        if len(result) == 0:
            return []
        else:
            return result

    def get_count_query(self):
        parameters = []
        query = f"SELECT VALUE COUNT(1) FROM c"
        result = list(self.container_client.query_items(query=query, parameters=parameters,
                                                                     enable_cross_partition_query =True))
        if len(result) == 0:
            return 0
        else:
            return result[0]

    def get_max_id(self):
        parameters = []
        query = f"SELECT VALUE MAX(c.use_case_id) FROM c"
        result = list(self.container_client.query_items(query=query, parameters=parameters,
                                                                     enable_cross_partition_query =True))
        if len(result) == 0:
            return 0
        else:
            return result[0]

    def get_usecase_names_query(self):
        query = f"SELECT VALUE c.UseCaseDetails.UseCaseName FROM c"
        result = list(self.container_client.query_items(query=query, parameters=[],
                                                                     enable_cross_partition_query =True))
        
        if len(result) == 0:
            return []
        else:
            return result

    def delete_query(self, id, use_case_id):
        print(id, use_case_id, type(id), type(use_case_id))
        query = self.container_client.read_item(item=id, partition_key=int(use_case_id))        
        if query:
            resp = self.container_client.delete_item(item=id, partition_key=int(use_case_id))
            return resp
        else:
            return True