export const service = {
    getEstimation: (helpFormData: any) => {
      const attributes: any = {};
      const oneTimeAttributes: any = {};
      const monthlyAttributes: any = {};
      switch (helpFormData.typeOfAns) {
        case "Comprehensive answers (Typically several paragraphs)":
            attributes.chunksPerPage = 2;
            attributes.chunkSize = helpFormData.chunkSize ? helpFormData.chunkSize : 1500;
            break;
        case "Pointed detail oriented questions  (Single/multi-line)":
            attributes.chunksPerPage = 6;
            attributes.chunkSize = helpFormData.chunkSize ? helpFormData.chunkSize : 512;
            break;
        case "Mixed (Mixture of both)":
            attributes.chunksPerPage = 4;
            attributes.chunkSize = helpFormData.chunkSize ? helpFormData.chunkSize : 1000;
            break;
      }
      attributes.totalChunkOneTime = attributes.chunksPerPage * helpFormData.pagePerDoc * helpFormData.docsIngested;
      attributes.totalChunkMonthly = attributes.chunksPerPage * helpFormData.pagePerDoc * helpFormData.monthlyIncOfDocs;
      attributes.searchUnit = 1;
      attributes.maxToken = helpFormData.maxTokens ? +helpFormData.maxTokens : helpFormData.accuracy === "Superior" ? 1500 : 1000;
      attributes.chunksToRetrieve = helpFormData.accuracy === "Superior" ? 9 : 5;
      attributes.tokensPerQues = (attributes.chunksToRetrieve * attributes.chunkSize) + attributes.maxToken;

      oneTimeAttributes['Azure Document Intelligence'] = ((((+helpFormData.pdfPerc/100) * +helpFormData.docsIngested) * helpFormData.pagePerDoc)/1000)*6;
      oneTimeAttributes['Open AI (Embedding)'] = ((+helpFormData.pagePerDoc * attributes.totalChunkOneTime * attributes.chunkSize)/1000)*0.0001;
      oneTimeAttributes['Presedio'] = 0;
      oneTimeAttributes['BERT Keyword extractor'] = 0;
      oneTimeAttributes['Container costs'] = ((5/60)*(helpFormData.docsIngested))*(0.31);
      oneTimeAttributes['Total'] = 0;

      monthlyAttributes['Azure Document Intelligence'] = ((((+helpFormData.pdfPerc/100) * +helpFormData.monthlyIncOfDocs) * helpFormData.pagePerDoc)/1000)*6;
      monthlyAttributes['Open AI (Embedding)'] = ((+helpFormData.pagePerDoc * attributes.totalChunkMonthly * attributes.chunkSize)/1000)*0.0001;
      monthlyAttributes['Presedio'] = 0;
      monthlyAttributes['BERT Keyword extractor'] = 0;
      monthlyAttributes['Open AI (Retriever)'] = (((attributes.chunksToRetrieve*attributes.chunkSize*0.003)/1000)+ ((attributes.maxToken*0.004)/1000))* helpFormData.quesPerDay * 30;
      monthlyAttributes['Cosmos DB'] = 25;
      monthlyAttributes['Azure AI Search + semantic ranker'] = 0.11*730/1;
      monthlyAttributes['App Services'] = 0.164*730
      monthlyAttributes['Container costs'] = ((5/60)*(helpFormData.monthlyIncOfDocs))*(0.31);
      monthlyAttributes['Total'] = 0;

      if (helpFormData.accuracy === "Superior") {
        oneTimeAttributes['Presedio'] = helpFormData.piiDetection ? ((attributes.totalChunkOneTime/3)/3600)*0.31 : 0;
        oneTimeAttributes['BERT Keyword extractor'] = helpFormData.keywordsExtractor ? ((attributes.totalChunkOneTime/3)/3600)*0.31 : 0;
        monthlyAttributes['Presedio'] = helpFormData.piiDetection ? ((attributes.totalChunkMonthly/3)/3600)*0.31 : 0;
        monthlyAttributes['BERT Keyword extractor'] = helpFormData.keywordsExtractor ? ((attributes.totalChunkMonthly/3)/3600)*0.31 : 0;
        monthlyAttributes['Azure AI Search + semantic ranker'] = (0.11*730/1)+(helpFormData.quesPerDay*30*(1/1000));
      } else {
        oneTimeAttributes['Presedio'] = 0;
        oneTimeAttributes['BERT Keyword extractor'] = 0;
        monthlyAttributes['Presedio'] = 0;
        monthlyAttributes['BERT Keyword extractor'] = 0;
        monthlyAttributes['Azure AI Search + semantic ranker'] = 0.11*730/1;
      }

      for (var key of Object.keys(oneTimeAttributes)) {
        if (key !== 'Total'){
            oneTimeAttributes['Total'] += oneTimeAttributes[key];
        }
      }

      for (var key of Object.keys(monthlyAttributes)) {
        if (key !== 'Total'){
            monthlyAttributes['Total'] += monthlyAttributes[key];
        }
      }

      oneTimeAttributes['Total'] = parseFloat(oneTimeAttributes['Total'].toFixed(2));
      monthlyAttributes['Total'] = parseFloat(monthlyAttributes['Total'].toFixed(2));
      oneTimeAttributes['Container costs'] = parseFloat(oneTimeAttributes['Container costs'].toFixed(2));
      monthlyAttributes['Container costs'] = parseFloat(monthlyAttributes['Container costs'].toFixed(2));
      oneTimeAttributes['Presedio'] = parseFloat(oneTimeAttributes['Presedio'].toFixed(2));
      monthlyAttributes['Presedio'] = parseFloat(monthlyAttributes['Presedio'].toFixed(2));
      oneTimeAttributes['BERT Keyword extractor'] = parseFloat(oneTimeAttributes['BERT Keyword extractor'].toFixed(2));
      monthlyAttributes['BERT Keyword extractor'] = parseFloat(monthlyAttributes['BERT Keyword extractor'].toFixed(2));
      oneTimeAttributes['Azure Document Intelligence'] = parseFloat(oneTimeAttributes['Azure Document Intelligence'].toFixed(2));
      monthlyAttributes['Azure Document Intelligence'] = parseFloat(monthlyAttributes['Azure Document Intelligence'].toFixed(2));

      return {
        oneTimeAttributes, monthlyAttributes, attributes
      }
    },

    setPredifinedFormValues: (formData: any) => {
      const estimation = service.getEstimation(formData);
      const attributes = estimation.attributes;

      if (formData.accuracy === "Superior") {
        formData.piiDetection = true;
        formData.keywordsExtractor = true;
        formData.chunkSize = attributes.chunkSize;
        formData.diversity = 0.5;
        formData.threshold = 0.5;
        formData.ngram = 'Trigram';
        formData.queryType = 'vectorSemanticHybrid';
        formData.maxTokens = attributes.maxToken;
      } else {
        formData.piiDetection = false;
        formData.keywordsExtractor = false;
        formData.chunkSize = attributes.chunkSize;
        formData.diversity = 0;
        formData.threshold = 0;
        formData.ngram = [];
        formData.queryType = 'vectorSimpleHybrid';
        formData.maxTokens = attributes.maxToken;
      }

      return formData;
    }
  };

  export const parseJson = {
    parseRequest:(req: any) => {
      const [hour, min] = req.startTime.split(':');
      const startTime = new Date(req.startDate);
      startTime.setUTCHours(hour);
      startTime.setUTCMinutes(min);
      const startTimeUTC = startTime.toISOString();
      const reqData: any = {
        id: req.id || null,
        use_case_id: req.use_case_id || null,
        UseCaseDetails: {
          "UseCaseID": req.use_case_id,
          "NextTask" : "SourceSync",
          "NextTaskPositon": "0",
          "UseCaseName": req.useCaseName,
        },
        FileFinder: {
          "dataSource": req.dataSource,
          "dataSourceUrl": req.dataSourceUrl,
          "FolderName": req.folderName,
          "CommonPrefix": ""
        },
        SourceSync: {
          "dataSource": req.dataSource,
          "dataSourceUrl": req.dataSourceUrl,
          "FolderName": req.folderName,
          "CommonPrefix": "",
          "SharePointPath":"",
          "action": ""
        },
        DocParser: {
          "FileType": req.fileTypes,
          "MetaData":{"AccountName": req.accountName},
          "ADLSFullPath": "",
          "SharePointPath":""
        },
        Splitter: {
          "ChunkSize": req.chunkSize,
          "ChunkOverlap": 100,
          "Model": "text-embedding-ada-002"
        },
        Embedding: {
          "Model":"text-embedding-ada-002",
          "Sleep":1
        },
          
        StoreVectors: {
          "IndexName": req.useCaseName
        },
          
        Trigger: {
          "Type": "Recurrence",
          "frequency": req.frequency,
          "startTime": startTimeUTC,
          "weekDays": req.weekDays,
          "hours": req.hours,
          "minutes": ["0"]
        },
          
        Retriever: {
          "queryType" : req.queryType,
          "topn" : req.topn,
          "maxTokens" : req.maxTokens,
          "temperature" : req.temperature,
        },
        Frontend: {
          "formData": req
        }
      }

      if (req.piiDetection || req.keywordsExtractor) {
        reqData.DataServices = {};
        if (req.keywordsExtractor) {
          reqData.DataServices.KeyWordExtract = {
            "ModelPath":"/app/src/all-MiniLM-L6-v2",
            "KeyphraseNgramRange": req.ngram === 'Unigram' ? [1,1] : req.ngram === 'Bigram' ? [1,2] : [1,2,3],
            "StopWords": "english",
            "UseMMR": 1,
            "Diversity": req.diversity,
            "Threshold": req.threshold
          }
        }

        if (req.piiDetection) {
          reqData.DataServices.PIIExtraction = {
            "Key1":"Value1",
            "Key2":"Value2"
          }
        }
      }
      console.log(reqData);
      return reqData
    },
  };