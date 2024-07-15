import moment from "moment";

export class Filter {
    public static async getWhereDates (startDate: any, endDate: any) {
        const start = moment(startDate).startOf('day').utc().format();
        const end = moment(endDate).endOf('day').utc().format();

        return {
            start, 
            end
        }
    }
}