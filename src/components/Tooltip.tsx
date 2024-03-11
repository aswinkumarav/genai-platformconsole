import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { ImInfo } from "react-icons/im";
import Style from "../pages/Layout/styles/common.module.scss"

function CustomTooltip(props: any) {
  const renderTooltip = (data: any) => (
    <Tooltip id="button-tooltip" style={{backgroundColor: '#fff'}} {...data}>
      {props.content}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <Button variant="none" className={Style.infoBtn}><ImInfo style={{color: '#727272'}}/></Button>
    </OverlayTrigger>
  );
}

export default CustomTooltip;