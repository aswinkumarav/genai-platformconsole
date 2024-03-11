import { useState, useContext } from 'react';
import {Button, Col, Form, Row } from 'react-bootstrap';
import CheckBoxDropdown from '../../../components/CheckBoxDropdown';
import style from "../styles/useCaseForm.module.scss";
import '../styles/main.css';
import { service } from '../../../Service/CommonService';
import { formContext } from './list';
import { activeTabContext } from './UseCaseForms';
import BreakUpDetails from '../../../components/BreakUpDetails';

const fileTypeOptions = [
    { key: 'pdf', value: 'PDF' },
    { key: 'docx', value: 'DOCX' },
    { key: 'pptx', value: 'PPTX' }
];


const typeOfAnswers = [
  { key: 'Comprehensive answers (Typically several paragraphs)', value: 'Comprehensive answers (Typically several paragraphs)' },
  { key: 'Pointed detail oriented questions  (Single/multi-line)', value: 'Pointed detail oriented questions  (Single/multi-line)' },
  { key: 'Mixed (Mixture of both)', value: 'Mixed (Mixture of both)' }
]

const accuracy = [
    { key: 'Superior', value: 'Superior' },
    { key: 'Good', value: 'Good' }
]


function HelpMe() {
  const [validated, setValidated] = useState(false);
  const { formData, setFormData } = useContext(formContext);
  const { setActiveTab } = useContext(activeTabContext);
  const [ showEstimation, setShowEstimation] = useState(false)

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || formData.fileTypes.length === 0) {
      event.preventDefault();
      event.stopPropagation();
    } else {
        if (event.nativeEvent.submitter.id == 'estimate') {
          event.preventDefault();
          event.stopPropagation();
          setShowEstimation(true);
        } else {
          const resForm = service.setPredifinedFormValues(formData);
          setFormData(resForm);
          setFormData({...formData, ['helpMeDecide']: true });
          setActiveTab('details')
        }
    }
    
    setValidated(true);
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
  }

  const checkboxSelection = (selections: any, name: string) => {
    setFormData({...formData, [name]: selections});
  }


  return (
    <>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-4">
            <div className={style.usecaseHeader} style={{marginTop: '-25px'}}>Document Details</div>
          </Row>  
          <Row className="mb-4">
            <Form.Group as={Col} md="4" controlId="validationFileTypes">
              <CheckBoxDropdown
                fieldName="fileTypes"
                options={fileTypeOptions}
                validated={validated}
                label="File Types Ingested"
                form= {checkboxSelection}/>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationDocIngested">
                <Form.Label>Documents to be ingested</Form.Label>
                <Form.Control
                    required
                    type="number"
                    min={1}
                    max={1000}
                    step={1}
                    placeholder="Documents to be ingested"
                    name="docsIngested"
                    value={formData.docsIngested}
                    onChange={handleChange}
                    className={style.disableBGImage}
                />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationMonthlyIncrease">
                <Form.Label>Monthly increase of documents</Form.Label>
                <Form.Control
                    required
                    type="number"
                    min={1}
                    max={200}
                    step={1}
                    placeholder="Monthly increase of documents"
                    name="monthlyIncOfDocs"
                    value={formData.monthlyIncOfDocs}
                    onChange={handleChange}
                    className={style.disableBGImage}
                />
            </Form.Group>
          </Row>
          <Row className="mb-4">
          { formData.fileTypes.indexOf('pdf') >= 0 && <Form.Group as={Col} md="4" controlId="validationpdfPerc">
                <Form.Label>PDF%</Form.Label>
                <Form.Control
                    required
                    type="number"
                    min={1}
                    max={200}
                    step={1}
                    placeholder="PDF%"
                    name="pdfPerc"
                    value={formData.pdfPerc}
                    onChange={handleChange}
                    className={style.disableBGImage}
                />
            </Form.Group>}

            <Form.Group as={Col} md="4" controlId="validationPagePerDoc">
                <Form.Label>Pages per document</Form.Label>
                <Form.Control
                    required
                    type="number"
                    min={1}
                    max={200}
                    step={1}
                    placeholder="Pages per document"
                    name="pagePerDoc"
                    value={formData.pagePerDoc}
                    onChange={handleChange}
                    className={style.disableBGImage}
                />
            </Form.Group>
          </Row>
          
          <Row className="mb-4">
            <div className={style.usecaseHeader}>Use Case Details</div>
            </Row>  
          <Row className="mb-4">
          <Form.Group as={Col} md="4" controlId="validationTypeOfAns">
              <Form.Label>Type of answers for questions</Form.Label>
              <Form.Select required className={style.disableTickIcon} aria-label="Type of answers for questions" style={!formData.typeOfAns && validated ? { border: '1px solid #dc3545' } : {}} value={formData.typeOfAns} onChange={(e) => {
                  setFormData({...formData, ['typeOfAns']: e.target.value})
                }}
              >
                <option value=''>Select..</option>
                { typeOfAnswers.map((option: any) => (
                    <option value={option.key}>{ option.value }</option>
                )) }
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationPagePerDocQuesPerDay">
                <Form.Label>Questions per day</Form.Label>
                <Form.Control
                    required
                    type="number"
                    min={1}
                    max={2000}
                    step={1}
                    defaultValue={200}
                    placeholder="Questions per day"
                    name="quesPerDay"
                    value={formData.quesPerDay}
                    onChange={handleChange}
                    className={style.disableBGImage}
                />
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationAccuracy">
              <Form.Label>Accuracy</Form.Label>
              <Form.Select required className={style.disableTickIcon} aria-label="Accuracy" style={!formData.accuracy && validated ? { border: '1px solid #dc3545' } : {}} value={formData.accuracy} onChange={(e) => {
                  setFormData({...formData, ['accuracy']: e.target.value})
                }}
              >
                <option value=''>Select..</option>
                { accuracy.map((option: any) => (
                    <option value={option.key}>{ option.value }</option>
                )) }
              </Form.Select>
            </Form.Group>

          </Row>

          <div className={style.nextBtn}>
              <Button type="submit" style={{marginRight: '8px'}} id="estimate">Estimate</Button>
              <Button type="submit">Next</Button>
          </div>
        </Form>
        {(showEstimation || formData.id) && <BreakUpDetails />}
      </>
  );
}

export default HelpMe;