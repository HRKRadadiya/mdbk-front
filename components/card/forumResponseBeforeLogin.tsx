import router from 'next/router';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FORUM, FORUM_VOTE } from '../../constants/api';
import { LOGIN } from '../../constants/routes';
import { State } from '../../redux/reducers/rootReducer';
import { ApiMemberDelete, ApiMemberPost } from '../../service/api';
import { getUrl, humanizeDate, isEmpty, isValidUrl } from '../../utils/helper'
import ReadMore from '../ReadMore';

const ForumResponseBeforeLogin = ({ items, lastCardElementRef, index, setGetResponse, getResponse }: any) => {
    const { t } = useTranslation();

    const gotoLogin = () => {
        router.push(getUrl(router.locale, LOGIN))
    }

    return (
        <div className="postResult-card" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            <div className="profile-row">
                <img src="/grayuser.svg" />
                <p> {items?.side_character_profile?.nick_name} <span className="at-ago-dot">∙</span><span>{humanizeDate(new Date(items?.created_at), t)}</span></p>
            </div>
            <div className="profileContent-main">
                <div className="postResult-Usercontent hm-postResult-Usercontent">
                    <h3>({t('mdbkforum.Askedby')}) {items?.question?.name} ∙ {humanizeDate(new Date(items?.question?.created_at), t)}</h3>
                    <h4>{items?.question?.text}</h4>
                </div>

                <div className={`postResult-Readmore  hm-break-word-ctn ${(isEmpty(items?.forum_images) && isEmpty(items?.forum_links)) ? "" : "hm-postResult-Readmore"}`}>
                    <ReadMore>
                        <h5>{items?.text}</h5>
                    </ReadMore>
                </div>
            </div>
            {!isEmpty(items?.forum_images) &&
                <div className="Postcontent-image hm-Postcontent-image">
                    <a href={isEmpty(items?.forum_images) ? "" : items?.forum_images[0]} target="_blank"> <img src={items?.forum_images[0]} />
                    </a>
                </div>
            }
            {!isEmpty(items?.forum_links) && <div className="fe-Postcontent-link">
                <a href={isEmpty(items?.forum_links) ? "" : (isValidUrl(items?.forum_links[0]) ? items?.forum_links[0] : "http://" + items?.forum_links[0])} target="_blank">  <p>{items?.forum_links[0]}</p></a>
            </div>
            }
            <div className="profileContent-main">
                <div className="postResult-tags hm-postResult-tags at-pr-tag">
                    {items?.forum_hashtags.map((tag: any) => (
                        <p onClick={gotoLogin}>#{tag}</p>
                    ))}
                </div>

                <div className="postComment fe-padding-top-response">
                    <div className="ToalComments"
                        onClick={gotoLogin}
                    >
                        <p> {t('mdbkforum.Comments')} <span> {items?.forum_comments?.length} </span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForumResponseBeforeLogin
