export const getList = async (page: number): Promise<Response | null> => {
    const response = await fetch(`http://localhost:8000/useCase/list?page=${page}`, {
        method: "GET",
    }).then((res) => {
        return res.json()
    }).catch(() => {
        console.error("There was an issue fetching your data.");
        return null
    })

    return response
}

export const deleteData = async(id: string, useCaseId: number): Promise<Response | null> => {
    const response = await fetch(`http://localhost:8000/useCase/delete?id=${id}&use_case_id=${useCaseId}`, {
        method: "DELETE",
        body: JSON.stringify({
            messages: id
        }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(async (res) => {
        return res
    })
    .catch(() => {
        console.error("There was an issue in delete data.");
        let errRes: Response = {
            ...new Response,
            ok: false,
            status: 500,
        }
        return errRes;
    })
    return response
}


export const addusecase = async (messages: any): Promise<Response> => {
    const response = await fetch("http://localhost:8000/useCase/insert", {
        method: "POST",
        body: JSON.stringify({
            messages: messages
        }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(async (res) => {
        return res
    })
    .catch(() => {
        console.error("There was an issue in save data.");
        let errRes: Response = {
            ...new Response,
            ok: false,
            status: 500,
        }
        return errRes;
    })
    return response
}

// Function to make API calls
async function makeAPICall(endpoint: any) {
    try {
        const json = endpoint.body ? endpoint.body : '';
        const response = await fetch(endpoint.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: json,
        });
        if (!response.ok) {
            // if (!state.retryInProgress) {
            //     await retryFailedAPICall(endpoint, state);
            // }
        }
        return await response.json();
    } catch (error) {
        // if (!state.retryInProgress) {
        //     await retryFailedAPICall(endpoint, state);
        // }
        console.log('Error making API call:', error);
        throw error;
    }
}

// Function to handle retry logic
// async function retryFailedAPICall(endpoint: any, state:any) {
//     state.retryInProgress = true;
//     while (state.retryCount < state.maxRetries && !state.success) {
//         try {
//             await makeAPICall(endpoint, state);
//             state.success = true;
//         } catch (error) {
//             state.retryCount++;
//             console.log(`Retry attempt ${state.retryCount} for ${endpoint.url}`);
//         }
//     }

//     if (!state.success) {
//         console.log(`Failed to call ${endpoint.url} after ${state.maxRetries} attempts`);
//     }
// }

// Main function to execute API calls
export async function executeAPICalls(useCaseName: string, reqData: any) {
    const containerName = useCaseName;
    delete reqData.Frontend;
    console.log(reqData);
    const apiEndpoints = [
        {
            url: `http://localhost:8000/createStorageContainer`,
            body: JSON.stringify({useCaseName: containerName})
        },
        {
            url: `http://localhost:8000/createCosmosDbContainer`,
            body: JSON.stringify({useCaseName: containerName})
        },
        {
            url: `http://localhost:8000/createSearchServiceIndex`,
            body: JSON.stringify({useCaseName: containerName})
        },
        {
            url: `http://localhost:8000/createLogicAppWorkflow`,
            body: JSON.stringify(reqData)
        },
    ];
    for (const endpoint of apiEndpoints) {
        // const state = {
        //     retryCount: 0,
        //     maxRetries: 3,
        //     success: false,
        //     retryInProgress: false
        // }
        // await makeAPICall(endpoint, state);
        makeAPICall(endpoint);
    }
}