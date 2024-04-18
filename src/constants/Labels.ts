import { isEarthId } from "../utils/PlatFormUtils";
import { LocalImages } from "./imageUrlConstants";

export const SCREENS = {
  HOMESCREEN: {
    avatarName: "Robert Downey",
    appName: isEarthId() ? "EarthID" : "GlobaliD",
    category: "CATEGORIES",
    documentLabel: "useddocument",
    upload: "uploaddoc",
    History: "historyy",
    SocialMedialList: [
      {
        TITLE: "website",
        URI: LocalImages.SOCIAL_MEDIA_.webImage,
        DOMAIN: "https://yourdomain.com",
      },
      {
        TITLE: "Facebook",
        URI: LocalImages.SOCIAL_MEDIA_.facebookImage,
        DOMAIN: "https://facebook.com/username",
      },
      {
        TITLE: "Twitter",
        URI: LocalImages.SOCIAL_MEDIA_.twitterImage,
        DOMAIN: "https://twitter.com/username",
      },
      {
        TITLE: "Instagram",
        URI: LocalImages.SOCIAL_MEDIA_.instagramImage,
        DOMAIN: "https://instagram.com/username",
      },
      {
        TITLE: "LinkedIn",
        URI: LocalImages.SOCIAL_MEDIA_.linkdInImage,
        DOMAIN: "https://linkedin.com/username",
      },
      {
        TITLE: "Telegram",
        URI: LocalImages.SOCIAL_MEDIA_.telegramImage,
        DOMAIN: "https://telegram.com/username",
      },
    ],
    DocumentList: [
      {
        TITLE: "passport",
        URI: LocalImages.CATEGORIES.personalcardImage,
        COLOR: "#D7EFFB",
      },
      {
        TITLE: "nationalid",
        URI: LocalImages.CATEGORIES.educationImage,
        COLOR: "#FFDD9B",
      },
    ],

    categoryList: [
      {
        TITLE: "id",
        URI: LocalImages.CATEGORIES.personalcardImage,
        COLOR: "rgba(246, 189, 233, 1)",
      },
      {
        TITLE: "healthcare",
        URI: LocalImages.CATEGORIES.insuranceImage,
        COLOR: "#C5BDF6",
      },
      {
        TITLE: "travel",
        URI: LocalImages.CATEGORIES.travelImage,
        COLOR: "#33FFE0",
      },
      {
        TITLE: "insurance",
        URI: LocalImages.CATEGORIES.insuranceImage,
        COLOR: "#A5F7B0",
      },
      {
        TITLE: "education",
        URI: LocalImages.CATEGORIES.educationImage,
        COLOR: "#FFDD9B",
      },
      {
        TITLE: "employment",
        URI: LocalImages.CATEGORIES.employment,
        COLOR: "#FFAFAF",
      },
      {
        TITLE: "finance",
        URI: LocalImages.CATEGORIES.finance,
        COLOR: "#D7EFFB",
      },
    ],
    CategoryCustomiseList: [
      {
        TITLE: "username",
        VALUE: "Roberty Dowry",
        URI: LocalImages.SOCIAL_MEDIA_.webImage,
        DOMAIN: "name",
        CHECKED: true,
      },
      // {
      //   TITLE: "dob",
      //   VALUE: "25/12/1965",
      //   URI: LocalImages.SOCIAL_MEDIA_.webImage,
      //   DOMAIN: "https://yourdomain.com",
      //   CHECKED: true,
      // },
      {
        TITLE: "mobileno",
        VALUE: "+91 7373834595",
        URI: LocalImages.SOCIAL_MEDIA_.webImage,
        DOMAIN: "mobile",
        CHECKED: true,
      },
      {
        TITLE: "email",
        VALUE: "vicky@yopmail.com",
        URI: LocalImages.SOCIAL_MEDIA_.webImage,
        DOMAIN: "email",
        CHECKED: true,
      },

      {
        TITLE: "Website",
        URI: LocalImages.SOCIAL_MEDIA_.webImage,
        VALUE: "https://yourdomain.com",
        DOMAIN: "https://yourdomain.com",
        CHECKED: true,
      },
      {
        TITLE: "Facebook",
        URI: LocalImages.SOCIAL_MEDIA_.facebookImage,
        VALUE: "https://yourdomain.com",
        DOMAIN: "https://facebook.com/yourdomain",
        CHECKED: true,
      },
      // {
      //   TITLE: "twitter",
      //   URI: LocalImages.SOCIAL_MEDIA_.twitterImage,
      //   DOMAIN: "https://yourdomain.com",
      //   VALUE: "https://twitter.com/yourdomain",
      //   CHECKED: true,
      // },
      {
        TITLE: "Instagram",
        URI: LocalImages.SOCIAL_MEDIA_.instagramImage,
        VALUE: "https://yourdomain.com",
        DOMAIN: "https://instagram.com/yourdomain",
        CHECKED: true,
      },
      {
        TITLE: "LinkedIn",
        URI: LocalImages.SOCIAL_MEDIA_.linkdInImage,
        VALUE: "https://yourdomain.com",
        DOMAIN: "https://linkedin.com/yourdomain",
        CHECKED: true,
      },
      {
        TITLE: "Telegram",
        URI: LocalImages.SOCIAL_MEDIA_.telegramImage,
        VALUE: "https://yourdomain.com",
        DOMAIN: "https://telegram.com/yourdomain",
        CHECKED: true,
      },
      {
        TITLE: "Twitter",
        URI: LocalImages.SOCIAL_MEDIA_.twitterImage,
        VALUE: "https://yourdomain.com",
        DOMAIN: "https://twitter.com/yourdomain",
        CHECKED: true,
      },
    ],

    documentsDetailsList: [
      {
        ID: 1,
        TITLE: "RobertD_passport",
        SUBTITLE: "Uploaded: 21/05/2022",
        URI: LocalImages.documentsImage,
        COLOR: "#D7EFFB",
        UPLOADIMAGECOLOR: "#94c0d6",
      },
      {
        ID: 2,
        TITLE: "GBAMembership",
        SUBTITLE: "Uploaded: 21/05/2022",
        URI: LocalImages.documentsImage,
        COLOR: "#FFDD9B",
        UPLOADIMAGECOLOR: "#e2b96a",
      },
      {
        ID: 3,
        TITLE: "GBAMembership",
        SUBTITLE: "Uploaded: 21/05/2022",
        URI: LocalImages.documentsImage,
        COLOR: "#C5BDF6",
        UPLOADIMAGECOLOR: "#8881b6",
      },
      {
        ID: 4,
        TITLE: "GBAMembership",
        SUBTITLE: "Uploaded: 21/05/2022",
        URI: LocalImages.documentsImage,
        COLOR: "#F5BCE8",
        UPLOADIMAGECOLOR: "#aa6d9c",
      },
      {
        ID: 5,
        TITLE: "GBAMembership",
        SUBTITLE: "Uploaded: 21/05/2022",
        URI: LocalImages.CATEGORIES.travelImage,
        COLOR: "#F5BCE8",
        UPLOADIMAGECOLOR: "#94c0d6",
      },
      {
        ID: 6,
        TITLE: "GBAMembership",
        SUBTITLE: "Uploaded: 21/05/2022",
        URI: LocalImages.CATEGORIES.travelImage,
        COLOR: "#F5BCE8",
        UPLOADIMAGECOLOR: "#8881b6",
      },
    ],
  },
  LANDINGSCREEN: {
    setUpId: isEarthId() ? "landscreensetupearthId" : "landscreensetupid",
    instruction: "landscreeninstruction",
    BUTTON_LABEL: "buttonLabel",
  },

  LANGUAGESCREEN: {
    SELECT_LANGUAGE: "selectLanguage",
  },

  BACKUPIDENTYSCREEN: {
    instructionEarthID: "backupscreeninstructionEarthID",
    instruction: "backupscreeninstruction",
    instructions: "backupscreeninstructions",
  },
  SECURITYSCREEN: {
    instruction: "securityscreeninstruction",
    instructions: "securityscreeninstructions",
    PasscodeInstruction: "securityscreeninstructions",
    PasscodeInstructions: isEarthId()
      ? "passcodeinstructionEarthid"
      : "passcodeinstruction",
    confirmInstruction: "confirminstruction",
  },
  SHOWQRSCREEN: {
    instruction: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the`,
  },
  CATEGORYSCREEN: {
    categories: [
      {
        title: "ID",
        color: "rgba(246, 189, 233, 1)",
      },
      {
        title: "Education",
        color: "#FFDD9B",
      },
      {
        title: "Employment",
        color: "rgba(255, 175, 175, 1)",
      },
      {
        title: "Insurance",
        color: "rgba(255, 221, 155, 1)",
      },
      {
        title: "Healthcare",
        color: "rgba(191, 245, 206, 1)",
      },
      {
        title: "Travel",
        color: "rgba(246, 189, 233, 1)",
      },
      {
        title: "Finance",
        color: "rgb(215,239,251)",
      },
      
    ],
  },

  DRAWERMENUTITLES: {
    MY_PROFILE: "myProfile",
    HOME: "home",
    DOCUMENT: "document",
    HISTORY: "history",
    SETTING: "setting",
    LANGUAGE: "language",
    ABOUT_US: "aboutus",
    TERM_CONDITION: "termcondition",
    BACKUP: "backupidentity",
    DELETE_IDENTITY: "deleteyouridentity",
    LOGOUT: "logout",
    PAYMENT: "Payment",
  },
  HOMESCREENTITLES: {
    CATEGORIES: "categories",
  },
};
