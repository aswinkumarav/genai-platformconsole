import { useState, useContext } from 'react';
import {Button, Col, Form, Row } from 'react-bootstrap';
import style from "../styles/useCaseForm.module.scss";
import { activeTabContext } from './UseCaseForms';
import { formContext } from './list';
import CustomTooltip from '../../../components/Tooltip';
import BreakUpDetails from '../../../components/BreakUpDetails';


function RetrieverForms() {
  const [validated, setValidated] = useState(false);
  const { setActiveTab } = useContext(activeTabContext);
  const { formData, setFormData } = useContext(formContext);
  const [ showFieldMsg, setShowFieldMsg ] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setFormData({...formData, ['retriever']: true });
      setActiveTab('ui')
    }
    
    setValidated(true);
  };

  if (formData.retriever) {
    setFormData({...formData, ['retriever']: false });
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
  }

  const previousPage = () => {
    setFormData({...formData, ['retriever']: false });
    setActiveTab('dataProcessing')
  }

  const handleRadioboxChange = (event: any) => {
    const { name, id } = event.target;
    setFormData({...formData, [name]: id});
  }


  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" controlId="validationQueryType">
              <Form.Label>Query Type</Form.Label>
              <Form.Check
                  required
                  type="radio"
                  label="Vector"
                  name="queryType"
                  id='vector'
                  value={ formData.queryType }
                  checked={ formData.queryType == 'vector'}
                  className={style.labelStyle}
                  onChange={handleRadioboxChange}
                  style={{color: '#000 !important'}}
              />
              <Form.Check
                  type="radio"
                  label="Vector Simple Hybrid"
                  name="queryType"
                  id='vectorSimpleHybrid'
                  value={ formData.queryType }
                  checked={ formData.queryType == 'vectorSimpleHybrid'}
                  className={style.labelStyle}
                  onChange={handleRadioboxChange}
                  style={{color: '#000 !important'}}
              />
              <Form.Check
                  type="radio"
                  label="Vector Semantic Hybrid"
                  name="queryType"
                  id='vectorSemanticHybrid'
                  value={ formData.queryType }
                  checked={ formData.queryType == 'vectorSemanticHybrid'}
                  className={style.labelStyle}
                  onChange={handleRadioboxChange}
                  style={{color: '#000 !important'}}
              />
          </Form.Group>
          
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" controlId="validationtopn">
              <Form.Label>Top N documents</Form.Label>
              <CustomTooltip content="The value should be multiples of 1 and less than 8"/>
              <Form.Control
                  required
                  type="number"
                  min={1}
                  max={8}
                  step={1}
                  placeholder="Top N documents"
                  name="topn"
                  value={formData.topn}
                  onChange={handleChange}
                  className={style.disableBGImage}
              />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationMaxTokens">
              <Form.Label>Max Tokens</Form.Label>
              <CustomTooltip content="The value should be multiples of 100 and less than 2000"/>
              <Form.Control
                  required
                  type="number"
                  min={100}
                  max={2000}
                  step={100}
                  placeholder="Max Tokens"
                  name="maxTokens"
                  value={formData.maxTokens}
                  onChange={handleChange}
                  className={style.disableBGImage}
                  onFocus={() => setShowFieldMsg(true)}
                  onBlur={() => setShowFieldMsg(false)}
              />
              {showFieldMsg && <p className={style.fieldMsg}>* Changing this field may affect the cost estimation.</p>}
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationTemperature">
              <Form.Label>Temperature</Form.Label>
              <CustomTooltip content="The value should be multiples of 0.1 and less than 1.0"/>
              <Form.Control
                  required
                  type="number"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  placeholder="Temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className={style.disableBGImage}
              />
          </Form.Group>
        </Row>
          <div className={style.nextBtn}>
              <Button type="button" className={style.previousPageBtn} onClick={() => previousPage()}>Previous</Button>
              <Button type="submit">Next</Button>
          </div>
      </Form>
      <BreakUpDetails />
    </>
  );
}

export default RetrieverForms;