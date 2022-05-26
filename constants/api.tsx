export const BASE_URL = `http://newbizstart.iptime.org:3072`
// export const BASE_URL = `http://192.168.1.9:9000`
export const API_VERSION = `/api/v1`

export const DEFAULT_GRAY_USER = "images/gray_user.svg";

// Other APIS
export const FETCH_PROVINCE = `province`
export const FETCH_DISTRICT = `district`

// Clients APIS
export const CREATE_CLIENT_PROFILE = `clientProfile/create`
export const FETCH_CLIENT_PROFILE_BY_MEMBER_ID = `clientProfile/byMemberId`
export const FETCH_CLIENT_PROFILE_BY_PROFESSION = `clientProfile/%profession%`
export const GENERATE_CLIENT_PROFILE_VERIFICATION_CODE = `clientProfile/generateVerificationCode`
export const VERIFY_CLIENT_PROFILE_PHONE = `clientProfile/verifyPhone`

// Member Auth + Password Reset
export const CHECK_EMAIL = `member/check-email`
export const SEND_VERIFICATION_CODE = `member/send-verification-code`
export const MEMBER_VERIFY_EMAIL = `member/verify-email`
export const REGISTER = `member/register`
export const LOGIN = `member/login`
export const SOCIAL_AUTH = `member/social-auth`
export const RESET_PASSWORD_LINK = `member/reset-password-link`
export const CONFIRM_RESET_PASSWORD = `member/confirm-reset-password`

// Common Api
export const MEMBER_SWITCH_ACCOUNT = `member/switch-account`
export const PROVINCE = `province`
export const DISTRICT = `district`
export const SEND_PHONE_VERIFICATION_CODE = `profile/send-phone-verification-code`
export const CONFORM_PHONE_VERIFICATION_CODE = `profile/confirm-phone-verification`

// Side Character Profile View + Edit
export const SIDE_CHARACTER_PROFILE = `side-character/profile`
export const PROFILE_RELATED_IMAGES = `profile/related-images`
export const PROFILE_RELATED_IMAGE = `profile/related-image`
export const PROFILE_UPLOAD_PORTFOLIO = `profile/profile-picture`
export const SIDE_CHARACTER_EDIT_PROFILE_STEP1 = `side-character/edit-profile/step1`
export const SIDE_CHARACTER_EDIT_PROFILE_STEP2 = `side-character/edit-profile/step2`
export const SIDE_CHARACTER_EDIT_PROFILE_STEP3 = `side-character/edit-profile/step3`
export const SIDE_CHARACTER_DELETE_EXPERIENCE = `side-character/experience/%id%`

// Client Profile View + Edit
export const CLIENT_PROFILE = `client/profile`
export const CLIENT_EDIT_PROFILE_STEP1 = `client/edit-profile/step1`
export const CLIENT_EDIT_PROFILE_STEP2 = `client/edit-profile/step2`
export const CLIENT_EDIT_PROFILE_STEP3 = `client/edit-profile/step3`


// My Page Settings
export const MEMBER = "member"
export const MEMBER_MY_PROFILE = "member/my-profile"
export const MEMBER_CHANGE_NOTIFICATION_SETTING = "member/change/notification-setting"
export const MEMBER_EDITINFORMATION_SETTING = "member/edit-information-setting"

// b-coin
export const BCOIN_PACKAGES = "bcoin/packages"
export const PAYMENT_PURCHASE_PACKAGE = "payment/purchase-package"
export const PAYMENT_COIN_HISTORY = "payment/coin-history"

//search
export const SEARCH_SIDE_CHARACTER = "search/side-character"
export const SEARCH_CLIENT = "search/client"
export const REQUEST = "request"
export const REQUEST_CREATE = "request/create"
export const MESSAGE_CREATE = "message/create"
export const SEARCH_SENT_REQUESTS = "search/sent-requests"
export const REQUEST_MEMBER_PROFILE = "request/member-profile"
export const REQUEST_ID_CHANGE_STATUS = "request/%id%/change-status"

// Like-Unlike
export const MEMBER_LIKE_UNLIKE = "member/like-unlike"
export const SEARCH_MY_LIKE = "search/my-like"

// Report Api
export const MEMBER_REPORT_UNREPORT = "member/report-unreport"

// Project
export const PROJECT = "project"
export const MESSAGE_LIST = "message/message-list"
export const MESSAGE = "message"
export const SEARCH_PROJECT = "search/project"
export const PROJECT_ID_APPLICATION = "project/%id%/project-applicants"
export const PROJECT_PROJECT_APPLICANT_CHANGE_STATUS = "project/project-applicant/change-status"
export const PROJECT_APPLY_PROJECT_APPLICATION = "project/apply-project-application"
export const PROJECT_SIDE_CHARACTER_PROPOSALS = "project/side-character/proposals"
export const PROJECT_PROJECT_APPLICATION_DETAILS = "project/project-application-details"
export const SEARCH_WITHOUT_AUTH_PROJECT = "search/without-auth/project"

// Forum Api
export const FORUM_QUESTION_LIST = "forum/question-list"
export const FORUM_RESPONSE_LIST = "forum/response-list"
export const FORUM_VOTE = "forum/vote"
export const FORUM = "forum"
export const FORUM_REPORT_UNREPORT = "forum/report-unreport"
export const FORUM_CREATE = "forum/create"
export const FORUM_DRAFT_QUESTION = "forum/draft-question"
export const FORUM_COMMENT_CREATE = "forum/comment/create"
export const FORUM_COMMENT = "forum/comment"

// notification
export const MEMBER_NOTIFICATIONS = "member/notifications"

// Valid Token
export const MEMBER_IS_VALID_TOKEN = "/member/is-valid-token"
