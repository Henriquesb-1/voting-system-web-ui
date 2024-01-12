import Option from "./Option";
import PollStatus from "./PollStatus"

export default interface Poll {
    _id: number;
    _title: string;
    _startDate: string;
    _endDate: string;
    _status: PollStatus;
    _options: Option[];
    
}