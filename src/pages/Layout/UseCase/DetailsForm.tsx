import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import style from "../styles/useCaseForm.module.scss";
import Row from 'react-bootstrap/Row';
import { activeTabContext } from './UseCaseForms';
import { formContext } from './list';
import BreakUpDetails from '../../../components/BreakUpDetails';

const accounts = [
  { key: 'acct1', value: 'Account1' },
  { key: 'acct2', value: 'Account2' },
  { key: 'acct3', value: 'Account3' }
]

function DetailsForm(props: any) {
  const [validated, setValidated] = useState(false);
  const { setActiveTab } = useContext(activeTabContext);
  const { formData, setFormData } = useContext(formContext);

  if (formData.id) {
    const i = props.useCaseNames.indexOf(props.currentUseCase.useCaseName.toLowerCase());
    if (i >= 0) {
      props.useCaseNames.splice(i, 1);
    }
  }

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || props.useCaseNames.indexOf(formData.useCaseName.toLowerCase()) != -1) {
      event.preventDefault();
      event.stopPropagation();
    } else {
        setFormData({...formData, ['details']: true });
        setActiveTab('dataIngestion')
    }
    
    setValidated(true);
  };

  if (formData.details) {
    setFormData({...formData, ['details']: false });
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
  }

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    setFormData({...formData, [name]: checked, ['accountName']: ''});
  }

  const previousPage = () => {
    setFormData({...formData, ['details']: false });
    setActiveTab('helpMeDecide')
  }


  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" controlId="validationUseCaseName">
            <Form.Label>Use Case Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Use Case Name"
              name="useCaseName"
              isInvalid={props.useCaseNames.indexOf(formData.useCaseName.toLowerCase()) >= 0}
              value={formData.useCaseName}
              onChange={handleChange}
              className={style.disableBGImage}
              disabled={formData.id ? true : false}
            />
            {props.useCaseNames.indexOf(formData.useCaseName.toLowerCase()) >= 0 && 
              <p style={{
                color: 'red',
                paddingTop: '4px',
                fontSize: '12px'
              }}>Use Case Name already exists.</p>
            }
          </Form.Group>
          <Form.Group as={Col} style={{padding: '36px 0px 0px 5rem'}} md="4" controlId="validationLeveraged">
              <Form.Check
                  type="checkbox"
                  label="Leveraged"
                  name="leveraged"
                  value={ formData.leveraged }
                  checked={ formData.leveraged == 'true' || formData.leveraged == true }
                  className={style.labelStyle}
                  onChange={handleCheckboxChange}
                  style={{color: '#000 !important'}}
              />
          </Form.Group>
          
          <Form.Group as={Col} md="4" controlId="validationAccountName">
              {formData.leveraged == false || formData.leveraged == 'false' ? (
                  <>
                      <Form.Label>Account Name</Form.Label>
                      <Form.Select required className={style.disableTickIcon} aria-label="account" style={validated && !formData.accountName ? { border: '1px solid #dc3545' } : {}} value={formData.accountName} onChange={(e) => {
                        setFormData({...formData, ['accountName']: e.target.value})
                      }}
                    >
                      <option value=''>Select..</option>
                      { accounts.map((option: any) => (
                          <option value={option.key}>{ option.value }</option>
                      )) }
                    </Form.Select>
                  </>
              ) : (
                  <></>
              )}
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" controlId="validationUseCaseOwner">
              <Form.Label>Use Case Owner</Form.Label>
              <Form.Control
                  required
                  type="text"
                  placeholder="Use Case Owner"
                  name="useCaseOwner"
                  value={formData.useCaseOwner}
                  onChange={handleChange}
                  className={style.disableBGImage}
              />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationfundedBy">
              <Form.Label>Funded By</Form.Label>
              <Form.Control
                  required
                  type="text"
                  placeholder="Funded By"
                  name="fundedBy"
                  value={formData.fundedBy}
                  onChange={handleChange}
                  className={style.disableBGImage}
              />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationIntendedUsers">
              <Form.Label>Intended Users</Form.Label>
              <Form.Control
                  required
                  type="text"
                  placeholder="Intended Users"
                  name="intendedUsers"
                  value={formData.intendedUsers}
                  onChange={handleChange}
                  className={style.disableBGImage}
              />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" controlId="validationDataCollected">
              <Form.Label>How often does data get collected</Form.Label>
              <Form.Control
                  required
                  type="text"
                  placeholder=""
                  name="dataCollected"
                  value={formData.dataCollected}
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

export default DetailsForm;