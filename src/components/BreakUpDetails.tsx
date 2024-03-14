import style from "../pages/Layout/styles/useCaseForm.module.scss";
import { FaCircleArrowRight } from "react-icons/fa6";
import {Col, Form, Table } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { service } from "../Service/CommonService";
import { formContext } from "../pages/Layout/UseCase/list";


function BreakUpDetails() {
    const [ splitType, setSplitType ] = useState('oneTime');
    const [ estimateCost, setEstimateCost ] = useState<any>({});
    const { formData } = useContext(formContext);

    const viewBreakUp = (flag: boolean) => {
        const helpMeSplitColTag = document.getElementsByClassName('card2');
        if (helpMeSplitColTag && helpMeSplitColTag[0]) {
            const ele = helpMeSplitColTag[0] as HTMLElement;
            ele.style.transform = flag ? 'translateX(0)' : 'translateX(115%)';
        }
    }


    useEffect(() => {
        const estimatedValue = service.getEstimation(formData);
        setEstimateCost(estimatedValue);
    }, [formData])
    
  return (
    <>
        <Col md="9" className="mb-5" style={{marginRight: '30px'}}>
            {(estimateCost.oneTimeAttributes || estimateCost.monthlyAttributes) && 
                <div className={style.estimateBox}>
                    <div className={style.estimatePrice}>
                        One Time Estimate: ${estimateCost.oneTimeAttributes['Total']} <br />
                        Monthly Estimate: ${estimateCost.monthlyAttributes['Total']}
                    </div>
                    <span className={style.estimateBreakUp} onClick={() => viewBreakUp(true)}>View Break Up</span>
                </div>
            }
        </Col>
        <Col md={4}  className={`${style.helpMeSplitCol} card2`}>
                <div className={`${style.card} ${style.helpMeSplitCard}`} style={{padding: '13px'}}>
                <span className='d-flex'>
                    <h5>Break-up Details</h5>
                    <span onClick={() => viewBreakUp(false)} className={style.backArr}><FaCircleArrowRight className={style.backArrIcon}/></span>
                </span>

                <div>
                    <div key={`inline-radio`} className="mb-3">
                        <Form.Check inline label="One Time" name="group1" type="radio"  id={`inline-radio-1`}
                            checked={ splitType == 'oneTime'}
                            onChange={() => setSplitType('oneTime')}
                            />
                        <Form.Check inline label="Monthly" name="group1" type="radio" id={`inline-radio-1`}
                            checked={ splitType == 'monthly'}
                            onChange={() => setSplitType('monthly')}
                        />
                        </div>
                </div>
                <div style={{marginRight: "18px"}}>
                    <Table>
                    <tbody>
                        {
                        splitType === 'oneTime' && estimateCost.oneTimeAttributes && 
                        Object.keys(estimateCost.oneTimeAttributes).map(key => (
                            <tr>
                            <td>{key}</td>
                            <td>{estimateCost.oneTimeAttributes[key]}</td>
                            </tr>
                        ))
                        }
                        {
                        splitType === 'monthly' && estimateCost.monthlyAttributes && 
                        Object.keys(estimateCost.monthlyAttributes).map(key => (
                            <tr>
                            <td>{key}</td>
                            <td>{estimateCost.monthlyAttributes[key]}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                    </Table>

                </div>
                </div>
            </Col>
        </>
    );
}

export default BreakUpDetails;