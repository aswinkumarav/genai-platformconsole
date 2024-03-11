import style from "../pages/Layout/styles/common.module.scss";
import Alert from 'react-bootstrap/Alert';
import { FiAlertTriangle } from "react-icons/fi";


function AlertBox(props: any) {

    const timer = setTimeout(() => {
        props.trigger(false);
        clearTimeout(timer);
    }, 12000);


  return (
    <Alert 
        className={`${style.alertBox}`}
        variant="warning"
        onClose={() => props.trigger(false)}
        dismissible
        transition
        show={props.show}
        >
        {/* <Alert.Heading style={{fontSize: 'medium'}}>Oh snap! You got an error!</Alert.Heading> */}
        <p style={{fontSize: 'medium', marginBottom: 0}}>
            <FiAlertTriangle className={style.alertIcon} /> {props.content}
        </p>
    </Alert>
  );
}

export default AlertBox;