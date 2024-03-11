import { useState, useContext } from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import style from "../styles/useCaseForm.module.scss";
import { activeTabContext } from './UseCaseForms';
import { formContext } from './list';
import CustomTooltip from '../../../components/Tooltip';
import BreakUpDetails from '../../../components/BreakUpDetails';

function DataProcessing() {
  const [validated, setValidated] = useState(false);
  const { setActiveTab } = useContext(activeTabContext);
  const { formData, setFormData } = useContext(formContext);
  const [ showFieldMsg, setShowFieldMsg ] = useState(false);
  const [ showFieldMsgPii, setShowFieldMsgPii ] = useState(false);
  const [ showFieldMsgKey, setShowFieldMsgKey ] = useState(false);

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || formData.ngram.length == 0) {
      event.preventDefault();
      event.stopPropagation();
    } else {
        setFormData({...formData, ['dataProcessing']: true });
        setActiveTab('retriever')
    }
    
    setValidated(true);
  };

  if (formData.dataProcessing) {
    setFormData({...formData, ['dataProcessing']: false });
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
  }

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    setFormData({...formData, [name]: checked});
  }

  const previousPage = () => {
    setFormData({...formData, ['dataProcessing']: false });
    setActiveTab('dataIngestion')
  }

  const handleRadioboxChange = (event: any) => {
    const { name, id } = event.target;
    setFormData({...formData, [name]: id});
  }

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Form.Group as={Col} style={{padding: '36px 0px 0px 0.8rem'}} md="4" controlId="validationPIIDetection">
              <Form.Check
                  type="checkbox"
                  label="PII Detection"
                  name="piiDetection"
                  value={ formData.piiDetection }
                  checked={ formData.piiDetection == 'true' || formData.piiDetection == true }
                  className={style.labelStyle}
                  onChange={handleCheckboxChange}
                  style={{color: '#000 !important'}}
                  onFocus={() => setShowFieldMsgPii(true)}
                  onBlur={() => setShowFieldMsgPii(false)}
              />
              {showFieldMsgPii && <p className={style.fieldMsg}>* Changing this field may affect the cost estimation.</p>}
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationChunkSize">
              <Form.Label>Chunk Size</Form.Label>
              <CustomTooltip content="The value should be multiples of 100 and less than 2000"/>
              <Form.Control
                  required
                  type="number"
                  min={100}
                  max={2000}
                  step={100}
                  placeholder="Chunk Size"
                  name="chunkSize"
                  value={formData.chunkSize}
                  onChange={handleChange}
                  className={style.disableBGImage}
                  onFocus={() => setShowFieldMsg(true)}
                  onBlur={() => setShowFieldMsg(false)}
              />
              {showFieldMsg && <p className={style.fieldMsg}>* Changing this field may affect the cost estimation.</p>}
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} style={{padding: '36px 0px 0px 0.8rem'}} md="4" controlId="validationKeywordsExtractor">
              <Form.Check
                  type="checkbox"
                  label="Keywords Extractor"
                  name="keywordsExtractor"
                  value={ formData.keywordsExtractor }
                  checked={ formData.keywordsExtractor == 'true' || formData.keywordsExtractor == true }
                  className={style.labelStyle}
                  onChange={handleCheckboxChange}
                  style={{color: '#000 !important'}}
                  onFocus={() => setShowFieldMsgKey(true)}
                  onBlur={() => setShowFieldMsgKey(false)}
              />
              {showFieldMsgKey && <p className={style.fieldMsg}>* Changing this field may affect the cost estimation.</p>}
          </Form.Group>
        </Row>
        { formData.keywordsExtractor && 
          <>
              <Row className="mb-4">
                  <Form.Group as={Col} md="4" controlId="validationdiversity">
                      <Form.Label>Diversity</Form.Label>
                      <CustomTooltip content="The value should be multiples of 0.1 and less than 1.0"/>
                      <Form.Control
                          required
                          type="number"
                          step={0.1}
                          min={0.1}
                          max={1.0}
                          placeholder="Diversity"
                          name="diversity"
                          value={formData.diversity}
                          onChange={handleChange}
                          className={style.disableBGImage}
                      />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationThreshold">
                      <Form.Label>Threshold</Form.Label>
                      <CustomTooltip content="The value should be multiples of 0.1 and less than 1.0"/>
                      <Form.Control
                          required
                          type="number"
                          step={0.1}
                          min={0.1}
                          max={1.0}
                          placeholder="Threshold"
                          name="threshold"
                          value={formData.threshold}
                          onChange={handleChange}
                          className={style.disableBGImage}
                      />
                  </Form.Group>
              </Row>
              <Row className="mb-4">
              <Form.Group as={Col} md="4" controlId="validationngram">
                <Form.Label>Keyword ngram</Form.Label>
                <Form.Check
                      required
                      type="radio"
                      label="Unigram"
                      name="ngram"
                      id='Unigram'
                      value={ formData.ngram }
                      checked={ formData.ngram == 'Unigram'}
                      className={style.labelStyle}
                      onChange={handleRadioboxChange}
                      style={{color: '#000 !important'}}
                  />
                  <Form.Check
                      type="radio"
                      label="Bigram"
                      name="ngram"
                      id='Bigram'
                      value={ formData.ngram }
                      checked={ formData.ngram == 'Bigram'}
                      className={style.labelStyle}
                      onChange={handleRadioboxChange}
                      style={{color: '#000 !important'}}
                  />
                  <Form.Check
                      type="radio"
                      label="Trigram"
                      name="ngram"
                      id='Trigrams'
                      value={ formData.ngram }
                      checked={ formData.ngram == 'Trigram'}
                      className={style.labelStyle}
                      onChange={handleRadioboxChange}
                      style={{color: '#000 !important'}}
                  />
              </Form.Group>
            </Row>
          </>
        }

          <div className={style.nextBtn}>
          <Button type="button" className={style.previousPageBtn} onClick={() => previousPage()}>Previous</Button>
              <Button type="submit">Next</Button>
          </div>
      </Form>
      <BreakUpDetails />
    </>
  );
}

export default DataProcessing;