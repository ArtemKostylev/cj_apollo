import { PageWrapper } from '~/components/pageWrapper';
import { Button } from '~/components/button';
import { PageLoader } from '~/components/pageLoader';
import { fetchAnnualReport } from '~/api/reports';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

export const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onDownloadClick = async () => {
        setLoading(true);
        try {
            const htmlString = await fetchAnnualReport();
            const pdf = new jsPDF({
                orientation: 'landscape'
            });

            pdf.html(htmlString, {
                callback: (doc) => {
                    doc.save();
                    setLoading(false);
                }
            });
        } catch {
            setError(true);
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <PageLoader loading={false} error={error}>
                <Button loading={loading} onClick={onDownloadClick}>{`Сформировать ведомость`}</Button>
            </PageLoader>
        </PageWrapper>
    );
};
