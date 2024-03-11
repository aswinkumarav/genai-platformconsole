import { useState, createContext, useContext } from "react";
import { Col, Row, Button } from "react-bootstrap";
import style from "../styles/useCaseForm.module.scss";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoCheckmarkCircle } from "react-icons/io5";
import DetailsForm from "./DetailsForm";
import { formContext } from "./list";
import { showFormContext } from "./list";
import DataIngestionForms from "./DataIngestionForms";
import DataProcessing from "./DataProcessingForms";
import RetrieverForms from "./RetrieverForms";
import HelpMe from "./HelpMe";
import UIForm from "./UIForm";

export const activeTabContext = createContext<any>({});
const usecase = [
    {
        label: 'Help Me Decide',
        value: 'helpMeDecide'
    },
    {
        label: 'Details',
        value: 'details'
    },
    {
        label: 'Data Ingestion',
        value: 'dataIngestion'
    },
    {
        label: 'Data Processing',
        value: 'dataProcessing'
    },
    {
        label: 'Retriever',
        value: 'retriever'
    },
    {
        label: 'UI',
        value: 'ui'
    }
    
];
function UseCaseForms(prop: any) {
    const [ activeTab, setActiveTab ] = useState('helpMeDecide');
    const { formData } = useContext(formContext);
    const { setShowForm } = useContext(showFormContext);

    return (
        <>
            <Row>
                <div style={{display: 'flex'}}>
                    <h4 style={{paddingBottom: '1rem'}}>{formData?.id ? 'Update Use Case' : 'Create New Use Case'}</h4>
                    <span style={{position: 'absolute', right: '2.8%'}}>
                        <Button style={{height: '32px'}} type="submit" onClick={() => setShowForm(false)}>Discard</Button>
                    </span>
                </div>
                <>
                    <Col md={3}>
                        <div className={style.card} style={{padding: '13px', overflow: 'auto', height: '70vh'}}>
                            <h5>Use Case</h5>
                            <div className={style.leftCard}>
                                {usecase.map((data: any, i: number) => (
                                    <>
                                        { i !== 0 ? (<div className={style.listLine}></div>) : (<></>)}
                                        <div className={style.useCaseListHeight}>
                                            {formData[data.value] ? (
                                                <span className={`${style.iconStyle}`} style={{color: 'green'}}><IoCheckmarkCircle className={style.checkmarkIcon}/></span>
                                            ) : activeTab === data.value ? (
                                                <span className={`${style.iconStyle} ${style.iconActive}`}><IoCheckmarkCircle className={style.checkmarkIcon}/></span>
                                            ) : (
                                                <span className={`${style.iconStyle}`}><IoCheckmarkCircleOutline className={style.checkmarkIcon}/></span>
                                            )}
                                            <span className={style.useCaseLabel}>{ data.label }</span>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </Col>
                    <Col md={9}>
                        <div className={style.card} style={{ overflow: 'auto', height: '70vh'}}>
                            <div className={style.rightCard}>
                                <activeTabContext.Provider value={{ activeTab, setActiveTab }}>
                                    { activeTab === 'details' ? (
                                        <DetailsForm useCaseNames={prop.useCaseNames} currentUseCase={prop.currentUseCase}/>
                                    ) : activeTab === 'dataIngestion' ? (
                                        <DataIngestionForms />
                                    ) : activeTab === 'dataProcessing' ? (
                                        <DataProcessing />
                                    ) : activeTab === 'retriever' ? (
                                        <RetrieverForms />
                                    ) : activeTab === 'helpMeDecide' ? (
                                        <HelpMe />
                                    ) : activeTab === 'ui' ? (
                                        <UIForm trigger={prop.trigger}/>
                                    ) : (
                                        <></>
                                    )
                                    }
                                </activeTabContext.Provider>
                            </div>
                        </div>
                    </Col>
                </>
            </Row>
        </>
    );
}

export default UseCaseForms;
