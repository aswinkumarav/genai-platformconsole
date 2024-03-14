import { useState, useContext } from 'react';
import {Button, Col, Form, Row } from 'react-bootstrap';
import style from "../styles/useCaseForm.module.scss";
import { activeTabContext } from './UseCaseForms';
import { formContext } from './list';
import { showFormContext } from "./list";
import { addusecase, executeAPICalls } from '../../../api/api';
import Spinner from "react-bootstrap/Spinner";
import AlertBox from '../../../components/AlertBox';
import { parseJson } from '../../../Service/CommonService';


function UIForm(prop: any) {
  const [validated, setValidated] = useState(false);
  const { setActiveTab } = useContext(activeTabContext);
  const { formData, setFormData } = useContext(formContext);
  const { setShowForm } = useContext(showFormContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
        setFormData({...formData, ['ui']: true });
        if (formData.chunkSize * formData.topn > 10000) {
            setShowAlert(true)
            setAlertContent('Adjust chunk size and top n so that chunk size * top n should be less than 10000.')
        } else {
            saveUseCase();   
        }
    }
    
    setValidated(true);
  };

  const saveUseCase = () => {
    setIsLoading(true);
    const date = new Date();
    const utcDateString = date.toISOString();
    if (!formData.id) {
        formData.createdAt = utcDateString;
    }
    formData.ui = true;
    const reqData = parseJson.parseRequest(formData);
    Object.setPrototypeOf(reqData, null);
    
    addusecase(reqData).then((res) => {
      if (!res.ok) {
        setShowAlert(true)
        setAlertContent('Error in Add/Update Use Case.')
      } else {
        executeAPICalls(formData.useCaseName, reqData);
        setShowForm(false);
        prop.trigger();
      }
      setIsLoading(false);
    })
  }

  if (formData.ui) {
    setFormData({...formData, ['ui']: false });
  }


  const previousPage = () => {
    setFormData({...formData, ['ui']: false });
    setActiveTab('retriever')
  }

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    setFormData({...formData, [name]: checked});
  }


  return (
    <>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-4">
            <div className={style.usecaseHeader} style={{marginTop: '-25px'}}>UI Configuration</div>
        </Row> 
        <Row className="mb-4">
        <Form.Group as={Col} style={{padding: '36px 0px 0px 5rem'}} md="4" controlId="validationuiRequired">
                <Form.Check
                    type="checkbox"
                    label="UI Required"
                    name="uiRequired"
                    value={ formData.uiRequired }
                    checked={ formData.uiRequired == 'true' || formData.uiRequired == true }
                    className={style.labelStyle}
                    onChange={handleCheckboxChange}
                    style={{color: '#000 !important'}}
                />
            </Form.Group>

            <Form.Group as={Col} style={{padding: '36px 0px 0px 5rem'}} md="4" controlId="validationChatHistory">
                <Form.Check
                    type="checkbox"
                    label="Chat History"
                    name="chatHistory"
                    value={ formData.chatHistory }
                    checked={ formData.chatHistory == 'true' || formData.chatHistory == true }
                    className={style.labelStyle}
                    onChange={handleCheckboxChange}
                    style={{color: '#000 !important'}}
                />
            </Form.Group>
        </Row>
            <div className={style.nextBtn} style={{marginTop: '10rem'}}>
                <Button disabled={isLoading} type="button" className={style.previousPageBtn} onClick={() => previousPage()}>Previous</Button>
                <Button disabled={isLoading} type="submit">
                {isLoading && <span>
                    <Spinner
                        animation="border"
                        role="status"
                        className={style.btnLoader}
                    ></Spinner>
                </span>}
                <span>{formData.id ? 'Update' : 'Submit'}</span></Button>
            </div>
        </Form>
        
        {/* {showAlert &&  */}
            <AlertBox content={alertContent} trigger={setShowAlert} show={showAlert}/>
        {/* } */}
        {/* <BreakUpDetails /> */}
  </>
  );
}

export default UIForm;