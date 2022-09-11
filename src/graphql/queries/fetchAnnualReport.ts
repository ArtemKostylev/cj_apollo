import {gql} from "@apollo/client";

export const FETCH_ANNUAL_REPORT = gql`
    query fetchAnnualReport($year: Int) {
        fetchAnnualReport(year: $year)
    }
`;
