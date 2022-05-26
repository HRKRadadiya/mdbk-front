import _ from 'lodash';
import router from 'next/router';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FORUM, FORUM_VOTE } from '../../constants/api';
import { LOGIN } from '../../constants/routes';
import { State } from '../../redux/reducers/rootReducer';
import { ApiMemberDelete, ApiMemberPost } from '../../service/api';
import { getUrl, humanizeDate, isEmpty } from '../../utils/helper';

const ForumQuestionBeforeLogin = ({ items, lastCardElementRef, index, setGetQuesion, getQuesion }: any) => {
    const { t } = useTranslation();

    const gotoLogin = () => {
        router.push(getUrl(router.locale, LOGIN))
    }

    return (
        <div className="Forum-qusetionCard-conatiner hm-Forum-qusetionCard-conatiner" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            <div className="Forum-qusetionCard hm-Forum-qusetionCard">
                <div className="profile-row">
                    <img src="/grayuser.svg" />
                    <p> {items?.client_profile?.nick_name}  <span className="at-ago-dot">∙</span> <span>  {humanizeDate(new Date(items?.created_at), t)}</span></p>
                </div>
                <div className="Forum-question-content">
                    <p>{items?.text}</p>
                </div>
                <div className="qusetionList-img">
                    <a href={_.get(items?.link_info, "og:image", null) == null ? "" : _.get(items?.link_info, "og:image", null)} target="_blank"> <img src={_.get(items?.link_info, "og:image", null) == null ? "" : _.get(items?.link_info, "og:image", null)} />
                    </a>
                    {_.get(items?.link_info, "url", null) == null ? "" :
                        <div className="fe-Postcontent-link">
                            <p><a href={_.get(items?.link_info, "url", null) == null ? "" : _.get(items?.link_info, "url", null)} target="_blank">{_.get(items?.link_info, "url", null)}</a></p>
                        </div>
                    }
                </div>
                <div className="profileContent-main answerResponse-row">
                    <div className="postAnswerResponse">
                        <div className="ToalComments" onClick={gotoLogin}>
                            <p> {t('mdbkforum.Response')} <span> {items?.total_response} </span></p>
                        </div>
                    </div>

                    <div className="answerBtnSection" onClick={gotoLogin}>
                        <button className="answerBtn" >{t('mdbkforum.Answer')}</button>
                    </div>

                </div>

            </div>


        </div>
    )
}

export default ForumQuestionBeforeLogin
