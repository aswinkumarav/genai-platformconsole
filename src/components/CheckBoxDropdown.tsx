import { Form, Dropdown} from 'react-bootstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useContext } from 'react';
import { formContext } from '../pages/Layout/UseCase/list';
import style from '../pages/Layout/styles/useCaseForm.module.scss'

function CheckBoxDropdown(props: any) {
    const { formData, setFormData } = useContext(formContext);

    const handleOptionChange = (option: string, name: string) => {
        const updatedSelection = formData[props.fieldName].includes(option)
            ? formData[props.fieldName].filter((selectedOption: string) => selectedOption !== option)
            : [...formData[props.fieldName], option]
        setFormData({...formData, [name]: updatedSelection});
        if (props.form) {
            props.form(updatedSelection, name);
            console.log(props.form)
        }
      }

    const renderOption = (key: string, value: string, name: string) => {
        return (
            <div>
                <input
                    type="checkbox"
                    id={key}
                    checked={formData[props.fieldName].includes(key)}
                    onChange={() => handleOptionChange(key, name)}
                    style={{height: '16px', width: '20px'}}
                />
                <label className={style.dropdownOPtionLabel} htmlFor={value}>{value}</label>
            </div>
        )
      }

    return (
        <>
            <Form.Label>{props.label}</Form.Label>
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="3dropdown-basic" style={props.validated && formData[props.fieldName].length == 0 ? { border: '1px solid #dc3545', width: '100%' } : { width: '100%' }}>
                    {
                        formData[props.fieldName].length == 0 ? (
                            <>
                                <span>
                                    <span className={style.floatLeft}>Select Options</span>
                                    <span className={style.floatRight}><RiArrowDropDownLine style={{ height: '22px', width: '22px' }} /></span>
                                </span>
                            </>
                        ) : formData[props.fieldName].length <= 2 ? (
                            formData[props.fieldName].map((fileType: string, i: number) => (
                                <>{i != 0 && <span>, </span>}{fileType}</>
                            ))
                        ) : (
                            `${formData[props.fieldName][0]} + ${(formData[props.fieldName].length - 1)} options`
                        )
                    }


                </Dropdown.Toggle>

                <Dropdown.Menu className={style.dropdownMenuStyle}>
                    {props.options.map((option: any) => (
                        renderOption(option.key, option.value, props.fieldName)
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

export default CheckBoxDropdown;