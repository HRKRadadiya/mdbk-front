import { useState } from 'react'
import { useTranslation } from 'react-i18next';

const ReadMore = ({ children }: any, fontStyle: string) => {
    const text = children?.props?.children;
    const { t } = useTranslation();
    const more = (text?.length > 120) ? true : false
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className="read-moreparagraph">
            {isReadMore ? text?.slice(0, 90) : text}{(more && isReadMore) ? ".." : ""}
            <span onClick={toggleReadMore} className="mb-0">
                {more && (isReadMore ? t('mdbkforum.Seemore') : t('mdbkforum.Showless'))}
            </span>
        </p>
    );
};

export default ReadMore;