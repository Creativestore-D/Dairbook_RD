import { USER_URL } from "../../app/crud/api";

export default {
  header: {
    self: {},
    items: [
      {
        title: "Dashboards",
        root: true,
        alignment: "left",
        page: USER_URL+"/dashboard",
        translate: "MENU.DASHBOARD"
      }
    ]
  },
  aside: {
    self: {},
    items: [
      {
        title: "Dashboard",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: USER_URL+"/dashboard",
        translate: "MENU.DASHBOARD",
        bullet: "dot"
      },
      {
        title: "Assets",
        root: true,
        bullet: "dot",
        icon: "flaticon2-layers-2",
        submenu: [
          {
            title: "Aircraft",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page: USER_URL+'/aircraft/asset',
          },
          {
            title: "Engines",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page: USER_URL+'/engine/asset',
          },
          {
            title: "APU",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page: USER_URL+'/apu/asset',
          },
          {
            title: "Parts",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page: USER_URL+'/part/asset',
          },
          {
            title: "Wanted",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page: USER_URL+'/wanted/asset',
          },
        ]
      },
      {
        title: "Leads",
        root: true,
        bullet: "dot",
        icon: "flaticon-network",
        page: USER_URL+'/lead',
      },
      {
        title: "Connections",
        root: true,
        bullet: "dot",
        icon: "flaticon-attachment",
        page: USER_URL+'/connection',
      },
      {
        title: "Favourites",
        root: true,
        bullet: "dot",
        icon: "flaticon-black",
        page: USER_URL+'/favourite',
      },
      {
        title: "Contacts",
        root: true,
        icon: "flaticon-avatar",
        page: USER_URL+'/contacts',
      },
      {
        title: "Promote Mode",
        root: true,
        icon: "flaticon-avatar",
        page: USER_URL+'/promote',
      },
      {
        title: "Layout Builder",
        root: true,
        icon: "flaticon2-expand",
        page: "builder"
      },
      {
        title: "My Company",
        root: true,
        bullet: "dot",
        icon: "flaticon-buildings",
        page: USER_URL+'/company/edit',
      },
    ]
  }
};
