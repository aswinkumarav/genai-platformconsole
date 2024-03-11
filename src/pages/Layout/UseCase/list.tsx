import { useState, createContext, useEffect } from "react";
import { Col, Row, Table, Pagination } from "react-bootstrap";
import Style from "../styles/common.module.scss";
import { IoSearch } from "react-icons/io5";
import listStyle from "../styles/useCaseList.module.scss";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import UseCaseForms from "./UseCaseForms";
import { getList, deleteData } from "../../../api/api";
import Spinner from "react-bootstrap/Spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

export const formContext = createContext<any>({});
export const showFormContext = createContext<any>({});
let pages: any = [];

function UseCaseList() {
    const [searchValue, setSearchValue] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [ activePage, setActivePage ] = useState(1);
    const [ list, setList ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ totalPage, setTotalPage ] = useState(1);
    const [ totalUseCase, setTotalUseCase ] = useState(0);
    const [ useCaseNames, setUseCaseNames ] = useState([]);
    const [ currentUseCase, setCurrentUseCase ] = useState({});

    const handlePagination = (page: number) => {
        if (page === activePage) {
            return;
        }
        setActivePage(page);
        getUseCaseList(page);
    }

    const PaginationItems = () => {
        if (pages.indexOf(activePage) == -1) {
            pages = [];
            for (let i = 1; i <= 5; i++) {
                pages.push((i+activePage)-1)
            }
        }
        
        return (
            pages.map((page: number) => (
                <Pagination.Item disabled={page > totalPage} onClick={() => {handlePagination(page)}} key={page} active={page === activePage}>
                    {page}
                </Pagination.Item>
            ))
        )
    }

    const initFormData = () => {
        const data = {
            useCaseName: '',
            leveraged: false,
            accountName: '',
            useCaseOwner: '',
            fundedBy: '',
            intendedUsers: '',
            dataCollected: '',
            fileTypes: [],
            dataSource: '',
            dataSourceUrl: '',
            target: '',
            frequency: '',
            startDate: '',
            startTime: '10:00',
            piiDetection: true,
            chunkSize: null,
            keywordsExtractor: true,
            diversity: null,
            threshold: null,
            ngram: [],
            queryType: '',
            topn: 5,
            maxTokens: null,
            temperature: 0.95,
            weekDays: [],
            docsIngested: null,
            monthlyIncOfDocs: null,
            pdfPerc: 50,
            pagePerDoc: 20,
            typeOfAns: '',
            accuracy: '',
            quesPerDay: 200,
            createdAt: '',
            uiRequired: true,
            chatHistory: true,
            folderName: [''],
            hours: []
        }
        setFormData(data);
    }

    useEffect(() => {
        initFormData();
        getUseCaseList(1);
    }, [])

    const handleSearchInput = (event: any) => {
        setSearchValue(event.target.value)
    }

    const editUseCase = (useCase: any) => {
        setFormData(useCase);
        setCurrentUseCase(useCase);
        setShowForm(true);
    }

    const deleteUseCase = (id: string, useCaseId: number) => {
        deleteData(id, useCaseId).then((res: any) => {

        })
    }

    const getUseCaseList = (page: number) => {
        setIsLoading(true);
        page = page ? page : activePage;
        getList(page).then((res: any) => {
            setList(res.result);
            setTotalUseCase(res.total);
            setTotalPage(Math.ceil(res.total/20));
            setIsLoading(false);
            const useCases = res.useCaseNames.map(function(r: any) {
                return r.toLowerCase();
            });
            setUseCaseNames(useCases);
        })
    }

    const createUseCase = () => {
        initFormData();
        setShowForm(true);
    }


    return (
        <div className={Style.container}>
            {!showForm ? (
                <>
                    <div>
                        <h3>UseCase List</h3>
                        <Row>
                            <Col md={12} style={{ height: '3rem' }}>
                                <div>
                                    <div className={listStyle.createNewBtn}>
                                        <button className={listStyle.createBtn} onClick={() => createUseCase()}>
                                            <span style={{ marginRight: '3px' }}><FaPlus style={{ color: '#5876aa', marginBottom: '3px' }} /></span>
                                            Create New
                                        </button>
                                    </div>
                                    <div className={listStyle.searchContainer}>
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchValue}
                                            onChange={handleSearchInput}
                                            className={listStyle.searchInput}
                                        />
                                        {searchValue ? (
                                            <RxCross2 style={{ cursor: 'pointer' }} className={Style.searchIcon} onClick={() => setSearchValue('')} />
                                        ) : (
                                            <IoSearch className={Style.searchIcon} />
                                        )
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className={listStyle.tableContainer}>
                                    <Table striped bordered hover className={listStyle.useCaseTable}>
                                        <thead style={{position: 'sticky', top: 0}}>
                                            <tr>
                                                <th>Use Case ID</th>
                                                <th>Use Case Name</th>
                                                <th>Leveraged</th>
                                                <th>Accounts</th>
                                                <th>Owner</th>
                                                <th>Funded By</th>
                                                <th>Chunk Size</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { !isLoading ? (
                                                list && list.length ? (list.map((usecase: any) => (
                                                    <tr>
                                                        <td className={`${listStyle.w155} ${listStyle.textElipsis}`}>{ usecase.id }</td>
                                                        <td className={listStyle.w185}>{ usecase.Frontend?.formData.useCaseName }</td>
                                                        <td className={listStyle.w155}>{ usecase.Frontend?.formData.leveraged ? 'True' : 'False' }</td>
                                                        <td className={listStyle.w185}>{ usecase.Frontend?.formData.accountName }</td>
                                                        <td className={listStyle.w155}>{ usecase.Frontend?.formData.useCaseOwner }</td>
                                                        <td className={listStyle.w155}>{ usecase.Frontend?.formData.fundedBy }</td>
                                                        <td className={listStyle.w155}>{ usecase.Frontend?.formData.chunkSize }</td>
                                                        <td className={listStyle.w115}>
                                                            <span onClick={() => editUseCase(usecase.Frontend?.formData)} className={listStyle.actionIcon}><FaRegEdit title="Edit" style={{color: '#5876aa'}}/></span>
                                                            <span onClick={() => deleteUseCase(usecase.id, usecase.use_case_id ? usecase.use_case_id : 'None')} className={listStyle.actionIcon}><RiDeleteBin6Fill title="Delete" style={{color: '#5876aa'}}/></span>
                                                        </td>
                                                    </tr>
                                                ))
                                                ) : (
                                                    <>
                                                        <div className={Style.tableCenter}>
                                                            <span className={Style.dataNotFound}>No Data Found. Click Create New to add UseCase.</span>
                                                            <div >
                                                            <button className={listStyle.createBtn} onClick={() => createUseCase()}>
                                                                <span style={{ marginRight: '3px' }}><FaPlus style={{ color: '#5876aa', marginBottom: '3px' }} /></span>
                                                                Create New
                                                            </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            ) : (
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                    className={Style.pageLoader}
                                                ></Spinner>
                                            ) }
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                            {!isLoading && list && list.length && <div style={{marginTop: '25px'}}>Showing {((activePage - 1) * 20) + 1} - {activePage * 20 > totalUseCase ? totalUseCase : activePage * 20 } of {totalUseCase}.</div>}
                        </Row>
                        {!isLoading && list && list.length && <Row className={listStyle.customPagination}>
                            <Pagination>
                                <Pagination.Prev disabled={activePage == 1} onClick={() => {activePage > 1 && handlePagination(activePage - 1)}}/>
                                <PaginationItems/>
                                <Pagination.Next disabled={totalPage == activePage} onClick={() => {handlePagination(activePage + 1)}}/>
                            </Pagination>
                        </Row>}
                    </div>
                </>
            ) : (
                <showFormContext.Provider value={{ showForm, setShowForm }}>
                    <formContext.Provider value={{ formData, setFormData }}>
                        <UseCaseForms trigger={getUseCaseList} useCaseNames={useCaseNames} currentUseCase={currentUseCase}/>
                    </formContext.Provider>
                </showFormContext.Provider>
            )}

        </div>
    );
}

export default UseCaseList;