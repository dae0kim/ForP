import { useParams } from "react-router";
import MbtiEvt from "./mbtiEvent/MbtiEvt";
function EventDetail() {
    const {id} = useParams();
    
    if(id==='1'){
        return <MbtiEvt />;
    }
    return <div>존재하지 않는 이벤트 입니다.</div>;
}

export default EventDetail;