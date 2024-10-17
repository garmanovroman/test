import React, { Component, useRef } from 'react';
import Network from '../../Components/Requests';
import TopPanelProject from '../../Components/TopPanelProject';
import 'react-tabs/style/react-tabs.css';
import DetailProject from '../../Components/DetailProject';
import { slide as Menu } from 'react-burger-menu';
import EditProfile from '../../Components/EditProfile';
import GroupChat from '../../Components/GroupChat';
import Links from '../../Components/Links';
import Tabs from '../../Components/Tabs';
import Logout from '../../Components/Logout';
import Analytics from '../../Components/Analytics';
import Calculations from '../../Components/Calculations';
import SelectCompany from '../../Components/SelectCompany';
import defaultImg from '../../images/def_chat.png';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AuthService from '../../Services/AuthService';
import ExportExel from '../../Components/ExportExel';
import DropzoneModal from '../../Components/DropzoneModal';

import TemplateProject from '../../Components/TemplateProject';
import EmplButton from '../../Components/EmplButton';
import Preloader from '../../Components/Preloader';
import SignalR from '../../Components/SignalR';
import PublicLink from '../../Components/forms/PublicLink';
import Projects from '../../Components/Projects';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import CopyTemplate from '../../Components/CopyTemplate';
import { Redirect } from 'react-router';
import { min, times } from 'lodash';
import ContextMenuLayer from '../../Components/ContextMenuLayer';
import { AddMenuForItemsProducts } from '../../Components/AddMenuForItemsProducts';
import { RenderCards } from '../../Components/RenderCards/RenderCards';
import ProjectGroups from '../../Components/ProjectGroups';
import NotificationComponent from '../../Notification/NotificationComponent';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      currentInterior: {},
      searchText: '',
      modal: false,
      writeVariantMessage: '',
      group: [],
      activeGroup: 0,
      activeGroupGuid: '',
      groupColor: '',
      authService: new AuthService(),
      openCatalog: false,
      userGuid: this.props.user,
      limit: 15,
      load: true,
      lastScrollTop: 0,
      companyIdIndex: null,
      loadDetail: false,
      lockImg: true,
      auth: false,
      items: [],
      prevGuid: '',
      firstReqGroup: true,
      timer: 0,
      menuOpen: false,
    };
    this.scroll = React.createRef();
    this.elementScroll = React.createRef();
    this.flexColumn = React.createRef();
    this.contentBase = React.createRef();
    // this.items = [
    //   { label: 'Copy', icon: 'pi pi-copy' },
    //   { label: 'Rename', icon: 'pi pi-file-edit' },
    // ];

    this.InteriorClicked = this.InteriorClicked.bind(this);
    this.OpenProject = this.OpenProject.bind(this);
    this.DeleteProject = this.DeleteProject.bind(this);
    this.handlerChangeCompany = this.handlerChangeCompany.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleChangeVariant = this.handleChangeVariant.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlerAddProject = this.handlerAddProject.bind(this);
    this.handlerChangeCatalogOpen = this.handlerChangeCatalogOpen.bind(this);
    this.handlerSetListProject = this.handlerSetListProject.bind(this);
    this.handlerDeletProject = this.handlerDeletProject.bind(this);
    this.handlerEnabledChat = this.handlerEnabledChat.bind(this);
    this.handlerGetPrev = this.handlerGetPrev.bind(this);
    this.setCurrentProject = this.setCurrentProject.bind(this);
    this.setGroup = this.setGroup.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
    this.scrollHorizontally = this.scrollHorizontally.bind(this);
    this.handlerSortChats = this.handlerSortChats.bind(this);
    this.handlerUpdateProject = this.handlerUpdateProject.bind(this);
    this.handleSetConnection = this.handleSetConnection.bind(this);
    this.handlerAdd = this.handlerAdd.bind(this);
    this.handlerReadMessage = this.handlerReadMessage.bind(this);
    this.handlerIconProjectChange = this.handlerIconProjectChange.bind(this);
    this.handlerCounterIncremented = this.handlerCounterIncremented.bind(this);
    this.scrollProject = this.scrollProject.bind(this);
    this.handlerUpdateLastMessage = this.handlerUpdateLastMessage.bind(this);
    this.clearCurrentVariant = this.clearCurrentVariant.bind(this);
    this.setLoadDetail = this.setLoadDetail.bind(this);
    this.handlerResetChat = this.handlerResetChat.bind(this);
    this.handlerClickInterior = this.handlerClickInterior.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.openGroup = this.openGroup.bind(this);
    this.cm = React.createRef(null);
  }

  async scrollProject() {
    const scrollElement = this.scroll.current.getBoundingClientRect();
    const scrollView = this.elementScroll.current.getBoundingClientRect();

    if (scrollElement.bottom > scrollView.top && this.state.load) {
      let WorkplaceStructuresElements = [];
      if (this.state.activeGroupGuid != '') {
        WorkplaceStructuresElements = await new Network().GetChildsWorkplaceStructuresForUserNew(
          this.state.structureId,
          this.state.activeGroupGuid,
          null,
          null,
          this.state.projects[this.state.projects.length - 1].id,
          this.state.projects[this.state.projects.length - 1].timestamp,
          null,
          null,
          15,
        );
        this.setState((prevState) => ({
          projects: [...prevState.projects, ...WorkplaceStructuresElements],
        }));
      } else if (this.state.searchText != '') {
        const WorkplaceStructuresElements =
          await new Network().GetChildsWorkplaceStructuresForUserNew(
            this.state.structureId,
            null,
            this.state.searchText,
            null,
            this.state.projects[this.state.projects.length - 1].id,
            this.state.projects[this.state.projects.length - 1].timestamp,
            null,
            null,
            15,
          );
        const add = this.state.projects.concat(WorkplaceStructuresElements);
        this.setState((prevState) => ({
          projects: add,
        }));
      } else {
        this.scroll.current.removeEventListener('scroll', this.scrollProject);

        WorkplaceStructuresElements = await new Network().GetChildsWorkplaceStructuresForUserNew(
          this.state.structureId,
          null,
          null,
          null,
          this.state.projects[this.state.projects.length - 1].id,
          this.state.projects[this.state.projects.length - 1].timestamp,
          null,
          null,
          this.state.limit,
        );
        if (WorkplaceStructuresElements.length > 0) {
          this.setState((prevState) => ({
            projects: [...prevState.projects, ...WorkplaceStructuresElements],
          }));
          this.scroll.current.addEventListener('scroll', this.scrollProject);
        }
      }
    }

    // if (this.lastScrollTop < this.scroll.current.scrollTop) {
    //   console.log('Вниз');
    // } else if (this.lastScrollTop > this.scroll.current.scrollTop) {
    //   console.log('Вверх');
    // }
    // this.setState({
    //   lastScrollTop: this.scroll.current.scrollTop,
    // });
    // console.log(this.lastScrollTop);
    // console.log(this.scroll.current.scrollTop);
  }

  async componentDidMount() {
    document.title = 'System123';
    this.scroll.current.addEventListener('scroll', this.scrollProject);
    // this.scroll.current.addEventListener('scroll', this.onScroll);

    let vh = window.innerHeight * 0.01;
    this.flexColumn.current.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', this.setHeight);

    this.contentBase.current.setAttribute('body-scroll-lock', 'lock');

    disableBodyScroll(this.contentBase, {
      allowTouchMove: (el) => {
        while (el && el !== document.body) {
          if (el.getAttribute('body-scroll-lock') === null) {
            return true;
          }

          el = el.parentElement;
        }
      },
    });

    const result = await new Network().GetUserGuid();
    if (result) {
      const fetch = async () => {
        await this.setState({
          auth: true,
        });
      };
      fetch();
    }
    this.initPage();
  }

  componentWillUnmount() {
    this.scroll.current.removeEventListener('scroll', this.scrollProject);
  }

  async componentWillUpdate() {}

  setHeight() {
    let vh = window.innerHeight * 0.01;

    this.flexColumn.current.style.setProperty('--vh', `${vh}px`);
  }

  async initPage(companyId = null) {
    const companyAr = await new Network().GetUserCompanies();
    if (companyId != undefined && companyId != null) {
      companyId = companyId;
    } else {
      var storage = localStorage.getItem('company');
      var storageCompany = JSON.parse(storage);

      var storageGroup = localStorage.getItem('group');

      if (storageCompany != null && storageCompany.id > 0) {
        companyId = storageCompany.id;
      } else {
        const isBase = companyAr?.filter((company) => company.isDefaultCompany == true);

        if (isBase[0]?.id > 0) {
          companyId = isBase[0]?.id;
        } else {
          companyId = null;
        }
      }
    }
    let groupGuid;
    if (storageGroup != null && storageGroup != 'null') {
      await this.setState({
        activeGroupGuid: storageGroup,
      });
      groupGuid = storageGroup;
    }

    const workplaceStructures = await new Network().GetRootsWorkplaceStructuresForUser(companyId);

    var structureId = new Number();
    if (workplaceStructures?.length != 0) {
      workplaceStructures.forEach(function (item, i, arr) {
        if (item.name == 'Проекты') {
          structureId = item.id;
        }
      });
    }

    const params = new URL(document.location).searchParams;

    let WorkplaceStructuresElements;
    const pr = params.get('pr');

    if (pr != null && pr?.length > 0) {
      WorkplaceStructuresElements = await new Network().GetChildsWorkplaceStructuresForUserNew(
        structureId,
        groupGuid,
        null,
        pr,
        null,
        null,
        true,
        null,
        this.state.limit,
      );
    } else {
      WorkplaceStructuresElements = await new Network().GetChildsWorkplaceStructuresForUserNew(
        structureId,
        groupGuid,
        null,
        null,
        null,
        null,
        null,
        null,
        this.state.limit,
      );
    }

    if (WorkplaceStructuresElements?.length > 0) {
      const userProject = await new Network().getUsersProject(
        WorkplaceStructuresElements[0]?.projectGuid,
      );

      WorkplaceStructuresElements[0].users = userProject;

      const types = localStorage.getItem('types');
      const views = localStorage.getItem('views');
      const project = localStorage.getItem('project');
      const storage = localStorage.getItem('company');
      var storageCompany = JSON.parse(storage);

      // this.setState({
      //   companyName: storageCompany.name,
      // });

      let currentInterior = {};

      await new Network().IncrementCounter(
        WorkplaceStructuresElements[0]?.projectGuid,
        3,
        this.state.userGuid,
      );
      WorkplaceStructuresElements[0].entryCount = WorkplaceStructuresElements[0].entryCount + 1;
      if (localStorage.getItem('joinLink') === 'true') {
        currentInterior = WorkplaceStructuresElements.find(
          (i) => i.projectGuid === localStorage.getItem('project'),
        );
      } else {
        currentInterior = WorkplaceStructuresElements[0];
      }

      //возврат по ссылки с ar/vr
      const pr = params.get('pr');
      if (pr != null && pr?.length > 0) {
        let currentProject = WorkplaceStructuresElements.find((project) => {
          if (project.projectGuid == pr) {
            return project.projectGuid;
          } else if (project.guidDisplayTape == pr) {
            return project.guidDisplayTape;
          }
        });

        const userProject = await new Network().getUsersProject(currentProject.projectGuid);
        currentProject.users = userProject;
        currentInterior = currentProject;
        window.history.pushState(null, null, '/app');
        this.OpenProject();

        // for (let index = 0; index < WorkplaceStructuresElements?.length; index++) {
        //   const element = WorkplaceStructuresElements[index];

        //   if (element.projectGuid == pr) {
        //     const userProject = await new Network().getUsersProject(element.projectGuid);
        //     element.users = userProject;
        //     currentInterior = element;
        //     window.history.pushState(null, null, '/app');
        //     this.OpenProject();
        //   }
        // }
      }

      const vr = params.get('variant');
      if (vr != null && vr?.length > 0) {
        await this.setState({
          currentVariant: vr,
        });
      }

      if (this.state.openCatalog == false) {
        await this.setState({
          projects: WorkplaceStructuresElements,
          currentInterior: currentInterior,
          companyAr: companyAr,
          types: types,
          views: views,
          structureId: structureId,
          companyId: companyId,
        });
      } else {
        await this.setState({
          projects: WorkplaceStructuresElements,
          companyAr: companyAr,
          types: types,
          views: views,
          companyId: companyId,
        });
      }
    } else {
      if (this.state.openCatalog == false) {
        await this.setState({
          projects: [],
          currentInterior: {},
          companyAr: companyAr,
          companyId: companyId,
        });
      } else {
        await this.setState({
          projects: [],
          companyAr: companyAr,
          companyId: companyId,
        });
      }
    }
  }

  async InteriorClicked(i) {
    if (
      this.state.currentInterior.projectGuid !== i.projectGuid ||
      this.state.currentInterior.guidDisplayTape !== i.guidDisplayTape
    ) {
      const userProject = await new Network().getUsersProject(i.projectGuid);
      this.OpenProject();
      i.users = userProject;
      await new Network().IncrementCounter(i.projectGuid, 3, this.state.userGuid);
      i.entryCount = i.entryCount + 1;
      this.setState({
        currentInterior: i,
        lockImg: true,
      });
    }
  }

  async setLoadDetail() {
    this.setState({
      loadDetail: true,
    });
  }

  async setCurrentProject(item) {
    this.setState({
      currentInterior: item,
      lockImg: true,
    });
  }

  async OpenProject() {
    var cusid_ele = document.getElementsByClassName('projects');
    cusid_ele[0].classList.toggle('active');
    var cusid_ele = document.getElementsByClassName('open-project');
    cusid_ele[0].classList.toggle('active');
  }

  async DeleteProject(e, index) {
    this.setState({
      modal: true,
      projectGuidDelete: e.projectGuid,
      indexDelDom: index,
    });
  }

  async handleClose() {
    await this.setState({ modal: false });
  }

  async handleDetele() {
    await new Network().DeleteProject(this.state.projectGuidDelete);
    document.querySelectorAll('.pr-item').forEach((i, ind) => {
      if (this.state.indexDelDom == ind) {
        document.querySelector('.pr-item').click();
        i.remove();
        this.handleClose();
      }
    });
  }

  async Search(event) {
    let guidGroup = this.state?.activeGroupGuid;
    guidGroup = this.state?.activeGroupGuid == 0 ? null : this.state?.activeGroupGuid;

    const WorkplaceStructuresElements = await new Network().GetChildsWorkplaceStructuresForUserNew(
      this.state.structureId,
      guidGroup,
      event,
      null,
      null,
      null,
      null,
      null,
      this.state.limit,
    );

    this.setState({
      searchText: event,
      projects: WorkplaceStructuresElements,
    });
  }

  searchAr(array, value) {
    value = value.toString().toLowerCase();
    return array.filter(function (o) {
      return Object.keys(o).some(function (k) {
        return o[k].toString().toLowerCase().indexOf(value) !== -1;
      });
    });
  }

  async handlerChangeCompany(e) {
    if (e == 'null') {
      e = null;
      this.setState({
        companyId: undefined,
      });
    } else {
      this.setState({
        companyId: e,
      });
    }
    this.initPage(e);
  }

  async handleChangeVariant(e, guidStoriesChat) {
    if (e?.constructor === Array) {
      var len = e.length;
      await this.setState({ writeVariantMessage: e[len - 1]?.calculationGuid });
    } else {
      await this.setState({ writeVariantMessage: e?.calculationGuid });
    }
  }

  async handlerAdd(e) {
    this.setState((prevState) => {
      // Check if the project already exists based on projectGuid
      const projectExists = prevState.projects.some(
        (project) => project.projectGuid === e.projectGuid,
      );

      // If the project does not exist, add it to the state
      if (!projectExists) {
        return {
          projects: [e, ...prevState.projects],
          currentInterior: e,
        };
      }
    });

    var el = document.getElementById('project-content');
    el.setAttribute('class', 'project-content');
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async handlerReadMessage(mes) {
    let copy = this.state.projects;
    for (let index = 0; index < copy.length; index++) {
      const element = copy[index];
      if (element.projectGuid == mes.guidProject) {
        let readCount =
          element.unreadMessagesCount > 0
            ? element.unreadMessagesCount - mes.readMessagesCount > 0
              ? element.unreadMessagesCount - mes.readMessagesCount
              : 0
            : 0;
        copy[index].unreadMessagesCount = readCount;
      }
    }
    this.setState((prevState) => ({
      projects: copy,
    }));
  }

  async handlerAddProject(e, setCurrent = true, search = false, guid, deleteGuids, toTop) {
    if (search == true) {
      let insertTop;
      for (let pr = 0; pr < this?.state?.projects?.length; pr++) {
        const element = this?.state?.projects[pr];
        if (element.projectGuid == guid) {
          insertTop = element;
        }
      }
      let delProject = this.state.projects.filter((el) => ![guid].includes(el.projectGuid));
      delProject.splice(0, 0, insertTop);
      this.setState((prevState) => ({
        projects: delProject,
        currentInterior: insertTop,
      }));
    } else {
      if (deleteGuids?.length > 0) {
        let delProject = this.state.projects.filter(
          (el) => !deleteGuids.includes(el.guidDisplayTape),
        );
        delProject.splice(0, 0, e);
        this.setState({ projects: delProject, currentInterior: e });
      } else {
        if (setCurrent == false) {
          this.setState((prevState) => ({
            projects: [e, ...prevState.projects],
          }));
        } else {
          this.setState((prevState) => ({
            projects: [e, ...prevState.projects],
            currentInterior: e,
          }));
        }
      }
    }

    if (toTop != false) {
      var el = document.getElementById('project-content');
      el.setAttribute('class', 'project-content');
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async handlerUpdateProject(e, guid) {
    let nameSplit = e.name?.split(/\s+/);
    this.setState({
      currentInterior: {
        ...this.state.currentInterior,
        name: e.name,
        orderNumber: e.orderNumber,
        address: e.address,
        customerFullName: e.customerFullName,
        phoneNumber: e.phoneNumber,
        clientEmail: e.clientEmail,
        amoCRMLink: e.amoCRMLink,
        idSourceType: e.idSourceType,
        idProductType: e.idProductType,
        sum: e.sum,
        orderDate: e.orderDate,
        expirationDate: e.expirationDate,
        orderCompletionDate: e.orderCompletionDate,
        archivedDate: e.archivedDate,
        feedback: e.feedback,
        description: e.description,
        workCosts: e.workCosts,
        materialCosts: e.materialCosts,
        costsNote: e.costsNote,
        projectNameOriginal: e.projectNameOriginal,
        currentCRMGroup: e.currentCRMGroup,
      },
      projects: this.state.projects.map((project) =>
        project.projectGuid === guid
          ? {
              ...project,
              name: e.name,
              orderNumber: e.orderNumber,
              address: e.address,
              customerFullName: e.customerFullName,
              phoneNumber: e.phoneNumber,
              clientEmail: e.clientEmail,
              amoCRMLink: e.amoCRMLink,
              idSourceType: e.idSourceType,
              idProductType: e.idProductType,
              sum: e.sum,
              orderDate: e.orderDate,
              expirationDate: e.expirationDate,
              orderCompletionDate: e.orderCompletionDate,
              archivedDate: e.archivedDate,
              feedback: e.feedback,
              description: e.description,
              workCosts: e.workCosts,
              materialCosts: e.materialCosts,
              costsNote: e.costsNote,
              projectNameOriginal: e.projectNameOriginal,
              currentCRMGroup: e.currentCRMGroup,
            }
          : project,
      ),
    });

    const currentProject = this.state.projects.find((project) => project.projectGuid == guid);
  }

  async handlerChangeCatalogOpen(e, guidVariant = '') {
    this.setState({
      openCatalog: e,
      currentVariant: guidVariant,
    });
  }

  async handlerSetListProject(guid) {
    // const project = await new Network().GetBaseProject(guid);
    // await this.setState({ currentInterior: project, projects: [project] });
  }

  async handlerDeletProject(e) {
    let indexDelet = '';
    for (let project = 0; project < this.state.projects.length; project++) {
      const element = this.state.projects[project];
      if (element.projectGuid == e) {
        indexDelet = project;
      }
    }
    let copy = this.state.projects;
    copy.splice(indexDelet, 1);
    this.setState({
      projects: copy,
      currentInterior: copy[0],
    });
  }

  async handlerEnabledChat(e) {
    await new Network().ShowOrHideChats(e, true);
    this.setState({
      currentInterior: {
        ...this.state.currentInterior,
        chatsEnabled: true,
      },
    });
  }

  async handlerGetPrev(e) {
    this.setState({
      prevGuid: e,
    });
  }

  async setGroup(e, updateGroup, folder) {
    if (updateGroup == true) {
      let groupData = await new Network().GetGroup(folder.guid);
      let groupColor = groupData?.color;
      let copyGroup = this.state?.group;

      for (let index = 0; index < copyGroup?.length; index++) {
        const element = copyGroup[index];
        if (element.guid == folder.guid) {
          let copyObject = { ...copyGroup[index] };
          copyObject = groupData;
        }
      }

      let copy = this.state.projects;
      for (let index = 0; index < copy?.length; index++) {
        const element = copy[index];
        if (folder?.isCRM == true && e.some((item) => item.guid == element.projectGuid)) {
          element.groups = [folder.guid];
        } else {
          let index = element.groups.findIndex((element) => element == folder.guid);
          if (index !== -1) {
            element.groups.splice(index, 1);
          }
        }
        if (folder?.isCRM == false) {
          if (e.some((item) => item.guid == element.projectGuid)) {
            element.groups.push(folder.guid);
          } else {
            let index = element.groups.findIndex((element) => element == folder.guid);
            if (index !== -1) {
              element.groups.splice(index, 1);
            }
          }
        }
      }
      if (this.state?.activeGroupGuid == folder.guid) {
        this.setState({
          projects: copy,
          group: copyGroup,
          groupColor: groupColor,
        });
      } else {
        this.setState({
          projects: copy,
          group: copyGroup,
        });
      }
    } else {
      this.setState({
        group: e,
      });
    }
  }

  async handlerClickInterior(item) {
    this.InteriorClicked(item);
  }
  async handlerResetChat() {
    let WorkplaceStructuresElements = [];
    if (this.state.activeGroupGuid != '') {
      WorkplaceStructuresElements = await new Network().GetChildsWorkplaceStructuresForUserNew(
        this.state.structureId,
        this.state.activeGroupGuid,
        null,
        null,
        null,
        null,
        null,
        null,
        15,
      );
      this.setState((prevState) => ({
        projects: [...WorkplaceStructuresElements],
      }));
    } else if (this.state.searchText != '') {
      const WorkplaceStructuresElements =
        await new Network().GetChildsWorkplaceStructuresForUserNew(
          this.state.structureId,
          null,
          this.state.searchText,
          null,
          null,
          null,
          null,
          null,
          15,
        );
      const add = this.state.projects.concat(WorkplaceStructuresElements);
      this.setState((prevState) => ({
        projects: add,
      }));
    } else {
      WorkplaceStructuresElements = await new Network().GetChildsWorkplaceStructuresForUserNew(
        this.state.structureId,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        this.state.limit,
      );
      if (WorkplaceStructuresElements.length > 0) {
        this.setState((prevState) => ({
          projects: [...WorkplaceStructuresElements],
        }));
      }
    }
  }

  async selectGroup(e, dom, color, indexx) {
    let ar = [];
    let el = dom.target;

    if (e == null) {
      const WorkplaceStructuresElements =
        await new Network().GetChildsWorkplaceStructuresForUserNew(
          this.state.structureId,
          null,
          this.state?.searchText,
          null,
          null,
          null,
          null,
          null,
          this.state.limit,
        );
      localStorage.setItem('group', JSON.stringify(null));

      this.setState({
        activeGroup: 0,
        activeGroupGuid: '',
        groupColor: '',
        projects: [...WorkplaceStructuresElements],
      });
    } else {
      var elGroup = document.getElementsByClassName('pr-group-item');
      let index = Array.from(elGroup).indexOf(el);
      localStorage.setItem('group', e);
      const WorkplaceStructuresElements =
        await new Network().GetChildsWorkplaceStructuresForUserNew(
          this.state.structureId,
          e,
          this.state?.searchText,
          null,
          null,
          null,
          null,
          null,
          this.state.limit,
        );

      this.setState({
        activeGroup: indexx,
        activeGroupGuid: e,
        groupColor: color,
        projects: [...WorkplaceStructuresElements],
      });
    }
  }

  async scrollHorizontally(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    document.querySelector('.project-groups').scrollLeft -= delta * 10; // Multiplied by 10
    e.preventDefault();
  }

  async changeSending(e) {
    this.setState({
      currentInterior: {
        ...this.state.currentInterior,
        isBaseProject: e,
      },
    });
  }

  async handlerSortChats(guid, content) {
    var index = this.state.projects.findIndex((proj) => proj.projectGuid == guid);
    var firstChat = this.state.projects.find((proj) => proj.projectGuid == guid);
    if (index > -1) {
      let copy = this.state.projects;

      if (index > -1) {
        copy.splice(index, 1);
      }
      copy.unshift(firstChat);
      if (this.state.currentInterior.projectGuid != guid) {
        firstChat.unreadMessagesCount += 1;
      } else {
        var el = document.getElementById('project-content');
        el.setAttribute('class', 'project-content');
        el.scrollTo({ top: 0, behavior: 'smooth' });
      }

      this.setState({
        projects: copy,
      });
    }
  }

  async handleSetConnection(connect) {
    await this.setState({
      connection: connect,
    });
  }

  async handlerIconProjectChange(projectGuidWithIconPath) {
    var searchedProjectIndex = this.state.projects.findIndex(
      (p) => projectGuidWithIconPath.guidProject == p.projectGuid,
    );
    if (searchedProjectIndex >= 0) {
      let copyOfProjects = [...this.state.projects];
      copyOfProjects[searchedProjectIndex].projectSmallPicturePath =
        projectGuidWithIconPath.smallPicturePath + '?v=' + Date.now();
      await this.setState({
        projects: copyOfProjects,
      });
    }
  }

  async handlerUpdateLastMessage(message) {
    const lastMessage = {
      content: message.content,
      createdAt: message.createdAt,
    };
    await this.setState({
      projects: this.state.projects.map((project) =>
        project.projectGuid === message.guidProject
          ? {
              ...project,
              lastMessage: lastMessage,
            }
          : project,
      ),
    });
  }

  async clearCurrentVariant() {
    await this.setState({
      currentVariant: '',
    });
  }

  async handlerCounterIncremented(counter) {
    const entryCounter = counter.projectCounters.entryCount;
    const viewCounter = counter.projectCounters.viewCount;
    const shareCounter = counter.projectCounters.shareCount;

    if (entryCounter != null) {
      await this.setState({
        projects: this.state.projects.map((project) =>
          project.projectGuid === counter.projectCounters.guidProject
            ? {
                ...project,
                entryCount: entryCounter,
              }
            : project,
        ),
      });
    }

    if (viewCounter != null) {
      await this.setState({
        projects: this.state.projects.map((project) =>
          project.projectGuid === counter.projectCounters.guidProject
            ? {
                ...project,
                viewCount: viewCounter,
              }
            : project,
        ),
      });
    }

    if (shareCounter != null) {
      await this.setState({
        projects: this.state.projects.map((project) =>
          project.projectGuid === counter.projectCounters.guidProject
            ? {
                ...project,
                shareCount: shareCounter,
              }
            : project,
        ),
      });
    }
  }

  async openGroup(project, group, calculation) {
    let item = this.state.group.findIndex((e, index) => {
      return e.guid == group;
    });

    const WorkplaceStructuresElements = await new Network().GetChildsWorkplaceStructuresForUserNew(
      this.state.structureId,
      group,
      null,
      null,
      null,
      null,
      null,
      null,
      this.state.limit,
    );

    this.setState({
      activeGroup: item + 1, //item
      activeGroupGuid: group,
      projects: [...WorkplaceStructuresElements],
    });
    let index = item + 2; //to do
    const el = document.querySelector('.pr-group-item:nth-child(' + index + ')');
    el.scrollIntoView({ block: 'center', inline: 'center' }); //
  }

  async showMenu(e) {
    this.setState({
      menuOpen: true,
    });
  }

  async fastClick(e) {}

  async closeMenu() {
    // document.querySelector('.bm-menu-wrap').style.transform = 'translate3d(-100%, 0px, 0px)';
    // document.querySelector('.bm-overlay').style.opacity = '0';
    // document.querySelector('.bm-overlay').style.transform = 'translate3d(100%, 0px, 0px)';
    // this.setState({ menuOpen: false }, () => {
    //   console.log('Menu closed:', this.state.menuOpen);
    // });
    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      keyCode: 27,
      code: 'Escape',
      which: 27,
      bubbles: true,
    });

    document.dispatchEvent(escEvent);
  }

  render() {
    return (
      <>
        {console.log('Test push 7')}
        {/* <NotificationComponent /> */}
        <SignalR
          connect={this.state.connection}
          user={this.state.userGuid}
          setConnection={(connect) => {
            this.handleSetConnection(connect);
          }}
          addProject={this.handlerAdd}
          readMessage={(mes) => this.handlerReadMessage(mes)}
          deleteProject={this.handlerDeletProject}
          iconProjectChange={(iconObj) => this.handlerIconProjectChange(iconObj)}
          incrementCounter={this.handlerCounterIncremented}
        />
        <Preloader />
        <PublicLink
          catalogOpen={this.state.openCatalog}
          openGroup={this.openGroup}
          setProject={this.setProject}
        />
        <CopyTemplate />
        <Dialog
          open={this.state.modal}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Вы уверены, что хотите удалить проект?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDetele()} color="primary">
              Да
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Нет
            </Button>
          </DialogActions>
        </Dialog>
        <div className="content-app flex-base" ref={this.contentBase}>
          <div className="project-select"></div>
          <div
            className={
              'projects ' +
              (localStorage.getItem('joinLink') == false ? '' : 'active ') +
              (this.state.views == 'mobile' ? 'hide' : 'show')
            }>
            <div className="projects-top flex-base flex-base--aic">
              <div className="user-action">
                {/* <Menu isOpen={this.state.menuOpen} onClose={() => this.closeMenu()}> */}
                <Menu>
                  <SelectCompany
                    onChangeCompany={this.handlerChangeCompany}
                    company={this.state?.companyAr}
                    companyId={this.state?.companyId}
                    user={this.state?.userGuid}
                  />
                  <a id="home" className="menu-item" href="/app">
                    Главная
                  </a>
                  <EditProfile />
                  <Links />
                  <GroupChat onSetGroup={(e, update, folder) => this.setGroup(e, update, folder)} />
                  <EmplButton
                    projects={this.state?.projects}
                    company={this.state?.companyId}
                    projectGuid={this?.state?.currentInterior?.projectGuid}
                  />
                  <ExportExel />
                  <DropzoneModal onCloseMenu={this.closeMenu} />
                  <Logout />
                  {this.state.companyId !== undefined && (
                    <div className="analytics">
                      <Analytics />
                    </div>
                  )}
                </Menu>
              </div>
              <div className="project--filter">
                <input
                  type="text"
                  placeholder="Поиск"
                  onChange={(event) => this.Search(event.target.value)}
                />
              </div>
              <Calculations
                onAddProject={this.handlerAddProject}
                company={this.state.companyId}
                changeCatalog={this.handlerChangeCatalogOpen}
              />
            </div>
            {this.state.group.length > 0 && (
              <ProjectGroups
                group={this.state.group}
                activeGroup={this.state.activeGroupGuid}
                scrollHorizontally={this.scrollHorizontally}
                selectGroup={this.selectGroup}
                groupColor={this.state.groupColor}
              />
            )}

            <div
              id="project-content"
              className={'project-content ' + (this.state.views == 'mobile' ? '' : '')}
              ref={this.scroll}>
              <TemplateProject
                setCurrentProject={this.setCurrentProject}
                onAddProject={this.handlerAddProject}
                projectGuid={this.state.currentInterior?.projectGuid}
                displayTape={this.state.currentInterior?.forDisplayTape}
                changeCatalog={this.handlerChangeCatalogOpen}
              />

              <RenderCards
                products={this.state.projects}
                currentInterior={this.state.currentInterior}
                InteriorClicked={this.InteriorClicked}
                groupColor={this.state.groupColor}
                onResetChat={this.handlerResetChat}
              />

              <div className="load-block-project" ref={this.elementScroll}></div>
            </div>
            <div
              className={
                'open-project ' + (localStorage.getItem('joinLink') == false ? '' : 'active ')
              }
              onClick={() => this.OpenProject()}></div>
          </div>

          <div className={'project-detail ' + (this.state.views == 'mobile' ? '' : '')}>
            <div className="dis-flex-colum" ref={this.flexColumn}>
              {this.state.projects?.length != 0 ? (
                <>
                  <TopPanelProject
                    onEnabledChat={this.handlerEnabledChat}
                    onDeleteProject={this.handlerDeletProject}
                    variantGuid={this.state.writeVariantMessage}
                    company={this.state.companyAr}
                    companyId={this.state.companyId}
                    companyName={this.state.companyName}
                    current={this.state.currentInterior}
                    changeBaseProject={(e) => this.changeSending(e)}
                    onUpdateProject={this.handlerUpdateProject}
                    onGetPrev={(e) => this.handlerGetPrev(e)}
                    view={this.state.views}
                    user={this.state.userGuid}
                    isOpenCatalog={this.state.openCatalog}
                  />
                  {this.state.currentInterior?.chats?.length && this.state.currentInterior ? (
                    <>
                      <DetailProject
                        currentChat={this.state.currentInterior.chats[0].guid}
                        onChangeVariant={this.handleChangeVariant}
                        guid={this.state.currentInterior?.projectGuid}
                        img={this.state.currentInterior.projectLargePicturePath}
                        descr={this.state.currentInterior.description}
                        name={this.state.currentInterior.name}
                        company={this.state.companyId}
                        current={this.state.currentInterior}
                        onAddProject={this.handlerAddProject}
                        openCatalog={this.state.openCatalog}
                        changeCatalog={this.handlerChangeCatalogOpen}
                        openTemplate={this.OpenProject}
                        currentVariant={this.state.currentVariant}
                        clearCurrentVariant={this.clearCurrentVariant}
                        user={this.state.userGuid}
                        loadDetail={this.setLoadDetail}
                        lockImg={this.state.lockImg}
                      />
                      {this.state.loadDetail && (
                        <Tabs
                          connect={this.state.connection}
                          variantGuid={this.state.writeVariantMessage}
                          project={this.state.currentInterior}
                          sortChat={this.handlerSortChats}
                          updateLastMessage={this.handlerUpdateLastMessage}
                          user={this?.state?.userGuid}
                        />
                      )}
                    </>
                  ) : (
                    'Не создан чат'
                  )}
                </>
              ) : (
                <div className="chat_container-no-prject">
                  <TopPanelProject
                    onEnabledChat={this.handlerEnabledChat}
                    onDeleteProject={this.handlerDeletProject}
                    variantGuid={this.state.writeVariantMessage}
                    company={this.state.companyAr}
                    companyId={this.state.companyId}
                    current={this.state.currentInterior}
                    changeBaseProject={(e) => this.changeSending(e)}
                    onUpdateProject={this.handlerUpdateProject}
                    onGetPrev={this.handlerGetPrev}
                  />
                  <p className="no-project">У Вас ещё нет добавленных проектов</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
