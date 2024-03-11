import { useState, useContext, useEffect } from 'react';
import {Button, Col, Form, Row } from 'react-bootstrap';
import { activeTabContext } from './UseCaseForms';
import { formContext } from './list';
import CheckBoxDropdown from '../../../components/CheckBoxDropdown';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import style from "../styles/useCaseForm.module.scss";
import '../styles/main.css';
import { IoMdClose } from "react-icons/io";
import BreakUpDetails from '../../../components/BreakUpDetails';

const fileTypeOptions = [
    { key: 'pdf', value: 'PDF' },
    { key: 'docx', value: 'DOCX' },
    { key: 'pptx', value: 'PPTX' }
];

const dataSources = [
  { key: 'sharePoint', value: 'SharePoint' },
  { key: 'adls', value: 'ADLS' }
]

const triggers = [
  { key: 'daily', value: 'Daily' },
  { key: 'weekly', value: 'Weekly' },
  { key: 'monthly', value: 'Monthly' }
]

const triggerDaysOption = [
  { key: 'Sunday', value: 'Sunday' },
  { key: 'Monday', value: 'Monday' },
  { key: 'Tuesday', value: 'Tuesday' },
  { key: 'Wednesday', value: 'Wednesday' },
  { key: 'Thursday', value: 'Thursday' },
  { key: 'Friday', value: 'Friday' },
  { key: 'Saturday', value: 'Saturday' },
]

let hoursOption: any = [];

function DataIngestionForms() {
  const [validated, setValidated] = useState(false);
  const { setActiveTab } = useContext(activeTabContext);
  const { formData, setFormData } = useContext(formContext);
  const [ time, setTIme ] = useState(formData.startTime)
  const [ rerender, setRerender] = useState(1);

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || formData.fileTypes.length === 0 ||
      formData.folderName[0] === ''
    ) {
      event.preventDefault();
      event.stopPropagation();
    } else {
        setFormData({...formData, ['dataIngestion']: true });
        setActiveTab('dataProcessing')
    }
    
    setValidated(true);
  };

  if (formData.dataIngestion) {
    setFormData({...formData, ['dataIngestion']: false });
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
  }

  const handleTimeChange = (ev: any) => {
    setTIme(ev);
    formData.startTime = ev;
  }

  const previousPage = () => {
    setFormData({...formData, ['dataIngestion']: false });
    setActiveTab('details')
  }

  const handleInputFolder = (event: any, i: number) => {
    const { name, value } = event.target;

    if (formData.folderName.length && formData.folderName[i] !== undefined) {
      formData.folderName[i] = value;
    } else {
      formData.folderName.push(value);
    }
    setFormData({...formData, [name]: value});
  }

  const removeFolder = (i:number) => {
    if (i !== -1 && formData.folderName[i] !== undefined) {
      formData.folderName.splice(i, 1);
      setRerender(rerender + 1);
    }
  }

  const getHoursOption = () => {
    hoursOption = [];
    for (let i = 0; i <= 23; i++) {
      hoursOption.push({key: i, value: i});
    }
  }

  useEffect(() => {

  },[rerender])

  useEffect(() => {getHoursOption()},[])


  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" controlId="validationFileType">
            <CheckBoxDropdown
              fieldName="fileTypes"
              options={fileTypeOptions}
              validated={validated}
              label="File Types Ingested"/>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationDataSources">
            <Form.Label>Data Sources</Form.Label>
            <Form.Select required className={style.disableTickIcon} aria-label="Data Sources" style={!formData.dataSource && validated ? { border: '1px solid #dc3545' } : {}} value={formData.dataSource} onChange={(e) => {
                setFormData({...formData, ['dataSource']: e.target.value})
              }}
            >
              <option value=''>Select..</option>
              { dataSources.map((option: any) => (
                  <option value={option.key}>{ option.value }</option>
              )) }
            </Form.Select>

              <span style={{display: 'flex'}}>
                <Form.Control
                  required
                  type="url"
                  placeholder="URL"
                  name="dataSourceUrl"
                  value={formData.dataSourceUrl}
                  onChange={handleChange}
                  className={`${style.disableBGImage} mt-3`}
                />
              </span>
          
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="" className="mt-5" style={{paddingTop: '1.2rem'}}>
            <span >
              {formData.folderName.map((folder: string, i: number) => (
                <>
                  <span style={{display: 'flex'}}>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Folder Name"
                      name={`FOLDER-${i}`}
                      value={folder}
                      onChange={() => {handleInputFolder(event, i)}}
                      className={`${style.disableBGImage} mt-3`}
                      style={formData.folderName.indexOf(folder) >=0 && formData.folderName.indexOf(folder) != i ? { border: '1px solid #dc3545' } : {}}
                    />
                    { formData.folderName.length > 1 && <span onClick={() => {removeFolder(i)}} style={{marginTop: '20px', marginLeft: '2px', cursor: 'pointer'}}><IoMdClose/></span> }
                  </span>
                </>
              ))}
            </span>
            { formData.folderName && formData.folderName.length < 5 && <Button variant="link" onClick={() => {handleInputFolder(event, -1)}} className={style.addNewBtn}>+ Add New</Button> }
          
          </Form.Group>
          
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" controlId="validationTarget">
              <Form.Label>Target</Form.Label>
              <Form.Select required className={style.disableTickIcon} aria-label="target" style={validated && !formData.target ? { border: '1px solid #dc3545' } : {}} value={formData.target} onChange={(e) => {
                setFormData({...formData, ['target']: e.target.value})
              }}
            >
              <option value=''>Select..</option>
              { [{key: 'azureAiSearch', value: 'Azure AI search'}].map((option: any) => (
                  <option value={option.key}>{ option.value }</option>
              )) }
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationTrigger">
            <Form.Label>Trigger Frequency</Form.Label>
            <Form.Select required className={style.disableTickIcon} aria-label="Trigger" style={validated && !formData.frequency ? { border: '1px solid #dc3545' } : {}} value={formData.frequency} onChange={(e) => {
                setFormData({...formData, ['frequency']: e.target.value})
              }}
            >
              <option value=''>Select..</option>
              { triggers.map((option: any) => (
                  <option value={option.key}>{ option.value }</option>
              )) }
            </Form.Select>
          </Form.Group>
          {formData.frequency === 'weekly' && <Form.Group as={Col} md="4" controlId="validationTriggerDays">
            <CheckBoxDropdown
              fieldName="weekDays"
              options={triggerDaysOption}
              validated={validated}
              label="On These Days"/>
          </Form.Group>}
        </Row>

        <Row className="mb-4">
          {(formData.frequency === 'weekly' || formData.frequency === 'daily') && <Form.Group as={Col} md="4" controlId="validationTriggerDays">
            <CheckBoxDropdown
              fieldName="hours"
              options={hoursOption}
              validated={validated}
              label="On These Hours"/>
          </Form.Group>}

        </Row>

        <Row className="mb-4">
        <Form.Group as={Col} md="4" controlId="validationStartDate">
              <Form.Label>Periodic Trigger Date</Form.Label>
              <Form.Control
                  required
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  placeholder="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={style.disableBGImage}
              />
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationStartTime">
              <Form.Label>Periodic Trigger Time [CST]</Form.Label>
              <div>
                <TimePicker required onChange={handleTimeChange} value={time} format='HH:mm' disableClock={true}/>
              </div>
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

export default DataIngestionForms;