import axios from 'axios';
import { globalConfig } from '../configuration/config';

const instance = axios.create({
  withCredentials: true,
});

export default class Network {
  constructor() {
    this.getUsersProject = this.getUsersProject.bind(this);
  }

  async GetUserCompanies() {
    const config = {};

    try {
      const response = await instance.get(`${globalConfig.config.common.api}Companies/GetForUser`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetUserId(companyId) {
    const config = {
      params: {
        companyId: companyId,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}WorkplaceStructures/GetRootsForUser`,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetOutputs(guidCalculation) {
    const config = {
      params: {
        guidCalculation: guidCalculation,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Calculation/GetOutputs`,
        config,
      );
      return response.data;
    } catch (error) {
      return { data: 'false' };
    }
  }

  async GetByCalculation(guidCalculation) {
    const config = {
      params: {
        guidCalculation: guidCalculation,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}CalculationExternalProductCard/GetByCalculation`,
        config,
      );
      return response.data;
    } catch (error) {
      return { data: 'false' };
    }
  }

  async GetRootsWorkplaceStructuresForUser(companyId) {
    const config = {
      params: {
        IdCompany: companyId,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}WorkplaceStructures/GetRootsForUser`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetCatalogFoldersTree(companyId) {
    const config = {
      params: {
        IdCompany: companyId,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}WorkplaceStructures/GetCatalogFoldersTree`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetChildsWorkplaceStructuresForUser(idParent, companyId) {
    const config = {
      params: {
        IdCompany: companyId,
        IdParentStructure: idParent,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}WorkplaceStructureElements/GetChildsForUser`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetCatalogPath(guidCalculation, isPathFromNames, guidProject) {
    const config = {
      params: {
        guidCalculation: guidCalculation,
        isPathFromNames: isPathFromNames,
        guidProject: guidProject,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}WorkplaceStructures/GetCatalogPath`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async UpdatePublicLink(
    type,
    dateActiveFrom,
    dateActiveTo,
    salesChannel,
    varietyType,
    publicLinkUrl,
    guidCalculation,
    guidProject,
    idCompany,
    guidDestinationGroup,
    companyPhoneNumber,
    idStartCatalogFolder,
    companyUsers,
    feedbackFormUrl,
    ShowSaveVariantButton,
    ShowPrice,
    startup3DType,
    guidDestinationGroupAfterSaveVariant,
  ) {
    const config = {
      type: type,
      dateActiveFrom: dateActiveFrom,
      dateActiveTo: dateActiveTo,
      salesChannel: salesChannel,
      varietyType: varietyType,
      publicLinkUrl: publicLinkUrl,
      guidCalculation: guidCalculation,
      guidProject: guidProject,
      idCompany: idCompany,
      guidDestinationGroup: guidDestinationGroup,
      companyPhoneNumber: companyPhoneNumber,
      idStartCatalogFolder: idStartCatalogFolder,
      companyUsers: companyUsers,
      feedbackFormUrl: feedbackFormUrl,
      ShowSaveVariantButton: ShowSaveVariantButton,
      ShowPrice: ShowPrice,
      startup3DType: startup3DType,
      guidDestinationGroupAfterSaveVariant: guidDestinationGroupAfterSaveVariant,
    };

    try {
      const response = await instance.put(
        `${globalConfig.config.common.api}StructureUrls/UpdatePublicLink`,
        config,
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        text: error?.response?.data,
      };
    }
  }

  async GetChildsWorkplaceStructuresForUserNew(
    IdParentStructure,
    guidGroup,
    searchText,
    guidLoad,
    id,
    timestamp,
    isMiddle,
    isUp,
    limit,
  ) {
    const config = {
      headers: {
        withCredentials: true,
      },
      params: {
        IdParentStructure: IdParentStructure,
        guidGroup: guidGroup,
        searchText: searchText,
        guid: guidLoad,
        id: id,
        timestamp: timestamp,
        isMiddle: isMiddle,
        isUp: isUp,
        limit: limit,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/GetForUser`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getUsersProject(guid) {
    if (guid != undefined && guid != '') {
      const config = {
        params: {
          projectGuid: guid,
        },
      };

      try {
        const response = await instance.get(
          `${globalConfig.config.common.api}Projects/GetProjectUsers`,
          config,
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async ShowOrHideChats(projectGuid, chatsEnabled) {
    const config = {
      params: {
        projectGuid: projectGuid,
        chatsEnabled: chatsEnabled,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/ShowOrHideChats`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(name, lastName, patronymic, email, phone) {
    const body = {
      name: name,
      lastName: lastName,
      patronymic: patronymic,
      email: email,
      phone: phone,
    };

    const config = {};

    try {
      await instance.post(`${globalConfig.config.common.api}Users/UpdateForUser`, body, config);
    } catch (error) {
      console.log(error);
    }
  }

  async GetPublicLink(
    type,
    dateActiveFrom,
    dateActiveTo,
    salesChannel,
    varietyType,
    guidCalculation,
    guidProject,
    idCompany,
    guidDestinationGroup,
    companyPhoneNumber,
    idStartCatalogFolder,
    companyUsers,
    feedbackFormUrl,
    ShowSaveVariantButton,
    ShowPrice,
    startup3DType,
    guidDestinationGroupAfterSaveVariant,
  ) {
    const body = {
      type: type,
      dateActiveFrom: dateActiveFrom,
      dateActiveTo: dateActiveTo,
      salesChannel: salesChannel,
      varietyType: varietyType,
      guidCalculation: guidCalculation,
      guidProject: guidProject,
      idCompany: idCompany,
      guidDestinationGroup: guidDestinationGroup,
      companyPhoneNumber: companyPhoneNumber,
      idStartCatalogFolder: idStartCatalogFolder,
      companyUsers: companyUsers,
      feedbackFormUrl: feedbackFormUrl,
      ShowSaveVariantButton: ShowSaveVariantButton,
      ShowPrice: ShowPrice,
      startup3DType: startup3DType,
      guidDestinationGroupAfterSaveVariant: guidDestinationGroupAfterSaveVariant,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}StructureUrls/GetPublicLink`,
        body,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        text: error?.response?.data,
      };
    }
  }

  async FollowPublicLinkAnonymously(structureUrl, uniqueDeviceIdentifier) {
    const body = {
      structureUrl: structureUrl,
      uniqueDeviceIdentifier: uniqueDeviceIdentifier,
      clientId: 'web-business-app',
    };

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}StructureUrls/FollowPublicLinkAnonymously`,
        body,
        // config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async FollowPublicLink(structureUrl, uuid) {
    const body = {
      structureUrl: structureUrl,
      uniqueDeviceIdentifier: uuid,
      clientId: 'web-business-app',
    };

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}StructureUrls/FollowPublicLink`,
        body,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async ChangeConnectionInfo(companyId, guidProject, guidRoom) {
    const body = {
      companyId: companyId,
      guidProject: guidProject,
      guidRoom: guidRoom,
    };

    const config = {};

    try {
      await instance.get(
        `${globalConfig.config.common.apiChat}/hubs/ChatHub/ChangeConnectionInfo`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async HandleUserInChats(chatsGuid, usersToAdd, usersToDelete) {
    const body = {
      chatsGuid: chatsGuid,
      usersToAdd: usersToAdd,
      usersToDelete: usersToDelete,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}Projects/HandleUserInChats`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async CreateProjectFromVariantsOfOtherProjects(
    projectGuids,
    name,
    orderNumber,
    address,
    customerFullName,
    phoneNumber,
    description,
    idCompany,
    amoCRMLink,
    source,
    productType,
    sum,
    expirationDate,
    requestDate,
    feedback,
  ) {
    const body = {
      projectGuids: projectGuids,
      project: {
        name: name,
        orderNumber: orderNumber,
        address: address,
        customerFullName: customerFullName,
        phoneNumber: phoneNumber,
        description: description,
        idCompany: idCompany,
        amoCRMLink: amoCRMLink,
        idSourceType: source,
        idProductType: productType,
        sum: sum,
        expirationDate: expirationDate,
        requestDate: requestDate,
        feedback: feedback,
      },
    };

    const config = {};

    try {
      const a = await instance.post(
        `${globalConfig.config.common.api}Projects/CreateProjectFromVariantsOfOtherProjects`,
        body,
        config,
      );
      return a.request.response;
    } catch (error) {
      console.log(error);
    }
  }

  async CreateProjectFromDisplayTapes(
    displayTapeGuids,
    name,
    orderNumber,
    address,
    customerFullName,
    phoneNumber,
    clientEmail,
    amoCRMLink,
    source,
    productType,
    sum,
    requestDate,
    orderDate,
    expirationDate,
    orderCompletionDate,
    archivedDate,
    feedback,
    description,
    workCosts,
    materialCosts,
    costsNote,
    idCompany,
  ) {
    const body = {
      displayTapeGuids: displayTapeGuids,
      project: {
        name: name,
        orderNumber: orderNumber,
        address: address,
        customerFullName: customerFullName,
        phoneNumber: phoneNumber,
        clientEmail: clientEmail,
        description: description,
        idCompany: idCompany,
        amoCRMLink: amoCRMLink,
        idSourceType: source,
        idProductType: productType,
        sum: sum,
        requestDate: requestDate,
        orderDate: orderDate,
        expirationDate: expirationDate,
        orderCompletionDate: orderCompletionDate,
        archivedDate: archivedDate,
        feedback: feedback,
        workCosts: workCosts,
        materialCosts: materialCosts,
        costsNote: costsNote,
      },
    };

    const config = {};

    try {
      const a = await instance.post(
        `${globalConfig.config.common.api}Projects/CreateProjectFromDisplayTapes`,
        body,
        config,
      );
      return a.request.response;
    } catch (error) {
      console.log(error);
    }
  }

  async updateAvatarUser(userGuid, formData) {
    const config = {};

    try {
      const a = await axios({
        url: `${globalConfig.config.common.api}Users/AddOrUpdateUserProfilePicture?userGuid=${userGuid}`,
        method: 'POST',
        data: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${token}`,
        },
      });
      return a.request.response;
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateMessage(guidMessage, content) {
    const body = {
      guidMessage: guidMessage,
      content: content,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}ChatMessages/UpdateMessage`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async AddVariantsFromDisplayTapes(displayTapeGuids, projectGuid) {
    const body = {
      displayTapeGuids: displayTapeGuids,
      projectGuid: projectGuid,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}Projects/AddVariantsFromDisplayTapes`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async SendMessageWithFiles(formData) {
    const config = {};

    try {
      const a = await instance({
        url: `${globalConfig.config.common.api}ChatMessages/SendMessageWithFiles`,
        method: 'POST',
        data: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${token}`,
        },
      });
      return a.request.response;
    } catch (error) {
      console.log(error);
    }
  }

  async getHistoryChat(chatGuid, limit, firstMessageGuid) {
    const config = {
      params: {
        chatGuid: chatGuid,
        limit: limit,
        firstMessageGuid: firstMessageGuid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}ChatMessages/GetMessagesByProjectGuid`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async Download(path) {
    const config = {
      params: {
        pathToFile: path,
      },
      responseType: 'arraybuffer',
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Data/DownloadFile`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetUserGuid() {
    // const token = JSON.parse(
    //   localStorage.getItem(
    //     `oidc.user:${globalConfig.config.auth.authority}:${globalConfig.config.auth.client_id}`,
    //   ),
    // ).access_token;

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Users/GetUserGuid`,
        {
          withCredentials: true,
        },
        // config,
      );
      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetPublicLinks(idCompany, pageNumber, pageSize) {
    const config = {
      params: { idCompany: idCompany, pageNumber: pageNumber, pageSize: pageSize },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}StructureUrls/GetPublicLinks`,
        config,
        {
          withCredentials: true,
        },
      );
      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetPublicLinkAnalytics(publicLinkUrl) {
    const config = {
      params: { publicLinkUrl: publicLinkUrl },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}StructureUrls/GetPublicLink`,
        config,
        {
          withCredentials: true,
        },
      );
      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async DeletePublicLink(url) {
    const config = {
      params: { url: url },
    };

    try {
      const response = await instance.delete(
        `${globalConfig.config.common.api}StructureUrls/DeletePublicLink`,
        config,
        {
          withCredentials: true,
        },
      );
      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetAllActive() {
    const config = {};

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Companies/GetAllActive`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async SendMessage(guidUser, guidChat, content, typeUser, guidCalculation, guidProject) {
    const body = {
      guidUser: guidUser,
      guidChat: guidChat,
      content: content,
      type: typeUser,
      guidCalculation: guidCalculation,
      guidProject: guidProject,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}ChatMessages/SendMessage`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async MoveProjectInGroup(guidProject, guidGroup) {
    const body = {
      guidProject: guidProject,
      guidGroup: guidGroup,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}Projects/MoveProjectInGroup`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async templateUpdate(id, content, idCompany) {
    const body = {
      id: id,
      content: content,
      idCompany: idCompany,
    };

    const config = {};

    try {
      await instance.post(`${globalConfig.config.common.api}MessageTemplates/Update`, body, config);
    } catch (error) {
      console.log(error);
    }
  }

  async templateDelete(id) {
    const config = {
      params: {
        id: id,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}MessageTemplates/Delete`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async templateSave(name, content, idCompany) {
    const body = {
      name: name,
      content: content,
      idCompany: idCompany,
    };

    const config = {};

    try {
      const a = await instance.post(
        `${globalConfig.config.common.api}MessageTemplates/Add`,
        body,
        config,
      );
      return a.data;
    } catch (error) {
      console.log(error);
    }
  }

  async IncrementCounter(guidProject, type, guidUser, content, typeUser, guidCalculation) {
    //const token = JSON.parse(localStorage.getItem(`oidc.user:${globalConfig.config.auth.authority}:${globalConfig.config.auth.client_id}`)).access_token;

    const body = {
      guidProject: guidProject,
      type: type,
      guidUser: guidUser,
    };

    const config = {
      // headers: {
      //     Authorization: `Bearer ${token}`
      // }
    };

    try {
      await instance.post(
        `${globalConfig.config.common.api}Projects/IncrementCounter`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async GetUsersInfo() {
    const config = {
      params: {},
    };

    try {
      const response = await instance.get(`${globalConfig.config.common.api}Users/GetUserInfo`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetVariants(projectGuid) {
    const config = {
      params: {
        projectGuid: projectGuid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/GetVariants`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetVariantss(guidProject, guidDisplayTape, flag, isUp, guidCalculation, limit) {
    const config = {
      params: {
        guidProject: guidProject,
        guidDisplayTape: guidDisplayTape,
        flag: flag,
        isUp: isUp,
        guidCalculation: guidCalculation,
        limit: limit,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}ProjectVariants/GetVariants`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetWorkplaceStructuresForCompany(IdCompany, IdParent) {
    const config = {
      params: {
        IdCompany: IdCompany,
        IdParent: IdParent,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}WorkplaceStructures/GetWorkplaceStructuresForCompany`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetCatalog(IdCompany, IdParent, isAllChats, idAccess) {
    const config = {
      params: {
        IdCompany: IdCompany,
        IdParent: IdParent,
        isAllChats: isAllChats,
        idAccess: idAccess,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}WorkplaceStructures/GetCatalog`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetForUserByProjectGuid(IdCompany, IdParent, isAllChats) {
    const config = {
      params: {
        IdCompany: IdCompany,
        IdParent: IdParent,
        isAllChats: isAllChats,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/GetForUserByProjectGuid`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetFileAzimuth(filePath) {
    const config = {
      params: {
        filePath: filePath,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Files/GetFileAzimuth`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetBaseProject(guid) {
    const config = {
      params: {
        guid: guid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/GetBaseProject`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async InviteEmail(
    chatGuid,
    guidCalculation,
    recipient,
    userName,
    lifeTimeHours,
    type,
    actorNumber,
    messageContent,
  ) {
    const body = {
      chatGuid: chatGuid,
      guidCalculation: guidCalculation,
      recipient: recipient,
      userName: userName,
      lifeTimeHours: lifeTimeHours,
      type: type,
      actorNumber: actorNumber,
      messageContent: messageContent,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}StructureUrls/SendLinkToEmail`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async OnlySendLinkToEmail(urlGuid, recipient) {
    const body = {
      urlGuid: urlGuid,
      recipient: recipient,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}StructureUrls/OnlySendLinkToEmail`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async InviteViber(
    chatGuid,
    guidCalculation,
    recipient,
    userName,
    lifeTimeHours,
    type,
    actorNumber,
    messageContent,
  ) {
    const body = {
      chatGuid: chatGuid,
      guidCalculation: guidCalculation,
      recipient: recipient,
      userName: userName,
      lifeTimeHours: lifeTimeHours,
      type: type,
      actorNumber: actorNumber,
      messageContent: messageContent,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}StructureUrls/SendLinkToViber`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async OnlySendLinkToViber(urlGuid, recipient) {
    const body = {
      urlGuid: urlGuid,
      recipient: recipient,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}StructureUrls/OnlySendLinkToViber`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async InviteSms(
    chatGuid,
    guidCalculation,
    recipient,
    userName,
    lifeTimeHours,
    type,
    actorNumber,
    messageContent,
  ) {
    const body = {
      chatGuid: chatGuid,
      guidCalculation: guidCalculation,
      recipient: recipient,
      userName: userName,
      lifeTimeHours: lifeTimeHours,
      type: type,
      actorNumber: actorNumber,
      messageContent: messageContent,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}StructureUrls/SendLinkToSMS`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async OnlySendLinkToSMS(urlGuid, recipient) {
    const body = {
      urlGuid: urlGuid,
      recipient: recipient,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}StructureUrls/OnlySendLinkToSMS`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async AddUserInChats(chatsGuid, userGuid, companyId) {
    const body = {
      chatsGuid: chatsGuid,
      userGuid: userGuid,
      companyId: companyId,
    };

    const config = {};

    try {
      await instance.post(`${globalConfig.config.common.api}Projects/AddUserInChats`, body, config);
    } catch (error) {
      console.log(error);
    }
  }

  async DeleteUserfromChats(chatsGuid, userGuid, companyId) {
    const body = {
      chatsGuid: chatsGuid,
      userGuid: userGuid,
      companyId: companyId,
    };

    const config = {};

    try {
      await instance.post(
        `${globalConfig.config.common.api}Projects/DeleteUserfromChats`,
        body,
        config,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async CreateQRCodeLink(chatGuid, guidCalculation, userName, lifeTimeHours, type, actorNumber) {
    const body = {
      chatGuid: chatGuid,
      guidCalculation: guidCalculation,
      userName: userName,
      lifeTimeHours: lifeTimeHours,
      type: type,
      actorNumber: actorNumber,
    };

    const config = {};

    try {
      const a = await instance.post(
        `${globalConfig.config.common.api}StructureUrls/CreateQRCodeLink`,
        body,
        config,
      );
      return a.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetCompanyUsers(companyId, projectGuid) {
    const config = {
      params: {
        companyId: companyId,
        projectGuid: projectGuid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Users/GetCompanyUsers`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetUserCatalog(guidProject, idCompany, idParent, idUser, type) {
    const config = {
      params: {
        guidProject: guidProject,
        idCompany: idCompany,
        idParent: idParent,
        idUser: idUser,
        type: type,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Companies/GetUserCatalog`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetUserCatalogWithoutLinkedUsers(idCompany, idParent, type) {
    const config = {
      params: {
        idCompany: idCompany,
        idParent: idParent,
        type: type,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Companies/GetUserCatalogWithoutLinkedUsers`,
        config,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetGroups(idCompany, guidProject = null) {
    const config = {
      params: {
        idCompany: idCompany,
        guidProject: guidProject,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Groups/GetGroups`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetAllTransitions(idCompany) {
    const config = {
      params: {
        idCompany: idCompany,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Transitions/GetAllTransitions`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async DeleteTransition(id) {
    const config = {
      params: {
        id: id,
      },
    };

    try {
      const response = await axios.delete(
        `${globalConfig.config.common.api}Transitions/DeleteTransition`,
        config,
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async DeleteCRMGroupsForCompany(idCompany) {
    const config = {
      params: {
        idCompany: idCompany,
      },
    };

    const response = await axios.delete(
      `${globalConfig.config.common.api}Groups/DeleteCRMGroupsForCompany`,
      config,
    );

    return response.data;
  }

  async AddTransition(guidFrom, guidTo) {
    const body = {
      guidGroupFrom: guidFrom,
      guidGroupTo: guidTo,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}Transitions/AddTransition`,
        body,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetByGuidGroup(guidGroup, idCompany) {
    const config = {
      params: {
        guidGroup: guidGroup,
        idCompany: idCompany,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/GetByGuidGroup`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetTagReference(idReferenceStructure, idCompany) {
    const config = {
      params: {
        idReferenceStructure: 100,
        idCompany: idCompany,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}ReferenceStructures/GetTagReference`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetCalculationsForUser(type, idCompany) {
    const config = {
      params: {
        tags: '#' + type,
        idCompany: idCompany,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Calculation/GetCalculationsForUser`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async JoinProjectByLink(url, clientId) {
    //const token = JSON.parse(localStorage.getItem(`oidc.user:${globalConfig.config.auth.authority}:${globalConfig.config.auth.client_id}`)).access_token;

    const config = {
      // headers: {
      //     Authorization: `Bearer ${token}`
      // },
      params: {
        url: url,
        clientId: clientId,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}StructureUrls/JoinProjectByLink`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async addUserProject(
    name,
    description,
    idCompany,
    calculationGuid,
    chatsEnabled,
    orderNumber,
    address,
    customerFullName,
    phoneNumber,
    clientEmail,
    amoCRMLink,
    source,
    productType,
    sum,
    requestDate,
    orderDate,
    expirationDate,
    orderCompletionDate,
    archivedDate,
    feedback,
    workCosts,
    materialCosts,
    costsNote,
  ) {
    const body = {
      name: name,
      description: description,
      idCompany: idCompany,
      calculationGuid: calculationGuid,
      chatsEnabled: chatsEnabled,
      orderNumber: orderNumber,
      address: address,
      customerFullName: customerFullName,
      phoneNumber: phoneNumber,
      clientEmail: clientEmail,
      amoCRMLink: amoCRMLink,
      idSourceType: source,
      idProductType: productType,
      sum: sum,
      requestDate: requestDate,
      orderDate: orderDate,
      expirationDate: expirationDate,
      orderCompletionDate: orderCompletionDate,
      archivedDate: archivedDate,
      feedback: feedback,
      workCosts: workCosts,
      materialCosts: materialCosts,
      costsNote: costsNote,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}Projects/AddForUser`,
        body,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async AddDisplayTape(guidCalculation, guidProject, guidUser, idCompany) {
    const body = {
      guidCalculation: guidCalculation,
      guidProject: guidProject,
      guidUser: guidUser,
      idCompany: idCompany,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}Projects/AddDisplayTape`,
        body,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetSourceTypes() {
    const config = {
      params: {},
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/GetSourceTypes`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetGroup(guidGroup) {
    const config = {
      params: {
        guidGroup: guidGroup,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Groups/GetGroup`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetProductTypes() {
    const config = {
      params: {},
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/GetProductTypes`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateProjectsInGroup(guidsProjects, guidGroup) {
    const body = {
      guidsProjects: guidsProjects,
      guidGroup: guidGroup,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}Groups/UpdateProjectsInGroup`,
        body,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateGroup(guid, name, color, isCrm) {
    const body = {
      guid: guid,
      name: name,
      color: color,
      isCRM: isCrm,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}Groups/UpdateGroup`,
        body,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetProjectsToManageGroups(idCompany, guidGroup, inGroup, id, timestamp, limit) {
    const config = {
      params: {
        idCompany: idCompany,
        guidGroup: guidGroup,
        inGroup: inGroup,
        id: id,
        timestamp: timestamp,
        limit: limit,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/GetProjectsToManageGroups`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async AddGroup(name, guidUser, idCompany, isCRM, color) {
    const body = {
      name: name,
      guidUser: guidUser,
      idCompany: idCompany,
      isCRM: isCRM,
      color: color,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}Groups/AddGroup`,
        body,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async AddCRMGroupsTemplate(idCompany) {
    const body = {
      idCompany: idCompany,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}Groups/AddCRMGroupsTemplate`,
        body,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async DeleteGroup(guid) {
    const config = {
      params: {
        guid: guid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Groups/DeleteGroup`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async AddVariant(calculationGuid, projectGuid, calculationName) {
    const body = {
      calculationGuid: calculationGuid,
      projectGuid: projectGuid,
      calculationName: calculationName,
    };

    const config = {};

    try {
      const response = await instance.post(
        `${globalConfig.config.common.api}Projects/AddVariant`,
        body,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetFileUrlInCloud(pathToFile, maxSize) {
    const config = {
      params: {
        pathToFile: pathToFile,
        maxSize: maxSize,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Data/GetFileUrlInCloud`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetAllTemplate(idCompany) {
    const config = {
      params: {
        idCompany: idCompany,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}MessageTemplates/GetAll`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async DeleteProject(projectGuid) {
    const config = {
      params: {
        projectGuid: projectGuid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/DeleteProject`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async DeleteVariant(calculationGuid) {
    const config = {
      params: {
        calculationGuid: calculationGuid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Projects/DeleteVariant`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetUserStructureUrl(userGuid, chatGuid) {
    const config = {
      params: {
        userGuid: userGuid,
        chatGuid: chatGuid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}StructureUrls/GetUserStructureUrl`,
        config,
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        text: 'Вы не приглашали данного пользователя в этот проект',
      };
      //console.log(error);
    }
  }

  async ShareCalculationWithCompanies(calculationGuid, companyIds) {
    const body = {
      calculationGuid: calculationGuid,
      companyIds: companyIds,
    };

    const config = {};

    try {
      const a = await instance.post(
        `${globalConfig.config.common.api}Calculation/ShareCalculationWithCompanies`,
        body,
        config,
      );
      return a.data;
    } catch (error) {
      console.log(error);
    }
  }

  async CopyProjectToCatalog(projectGuid) {
    const body = {
      projectGuid: projectGuid,
    };

    const config = {};

    try {
      const a = await instance.post(
        `${globalConfig.config.common.api}Projects/CopyProjectToCatalog`,
        body,
        config,
      );
      return a.data;
    } catch (error) {
      console.log(error);
    }
  }

  async Update(
    guidProject,
    name,
    orderNumber,
    address,
    customerFullName,
    phoneNumber,
    clientEmail,
    amoCRMLink,
    source,
    productType,
    sum,
    requestDate,
    orderDate,
    expirationDate,
    orderCompletionDate,
    archivedDate,
    feedback,
    description,
    workCosts,
    materialCosts,
    costsNote,
    guidGroup,
    idCompany,
  ) {
    const body = {
      guidProject: guidProject,
      name: name,
      orderNumber: orderNumber,
      address: address,
      customerFullName: customerFullName,
      phoneNumber: phoneNumber,
      clientEmail: clientEmail,
      amoCRMLink: amoCRMLink,
      idSourceType: source,
      idProductType: productType,
      sum: sum,
      requestDate: requestDate,
      orderDate: orderDate,
      expirationDate: expirationDate,
      orderCompletionDate: orderCompletionDate,
      archivedDate: archivedDate,
      feedback: feedback,
      description: description,
      workCosts: workCosts,
      materialCosts: materialCosts,
      costsNote: costsNote,
      guidGroup: guidGroup,
      idCompany: idCompany,
    };

    const config = {};

    try {
      const a = await instance.post(
        `${globalConfig.config.common.api}Projects/Update`,
        body,
        config,
      );
      return a.data;
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateStructureUrl(structureUrl, userName, lifeTimeHours) {
    const body = {
      structureUrl: structureUrl,
      userName: userName,
      lifeTimeHours: lifeTimeHours,
    };

    const config = {};

    try {
      const a = await instance.post(
        `${globalConfig.config.common.api}StructureUrls/UpdateStructureUrl`,
        body,
        config,
      );
      return a.data;
    } catch (error) {
      return {
        status: 'error',
      };
    }
  }

  async GetUnreadMessagesForUser(chatGuid, limit) {
    const config = {
      params: {
        chatGuid: chatGuid,
        limit: limit,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}ChatMessages/GetUnreadMessagesForUser`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async DownloadFileInChat(path, fileType, fileName) {
    axios({
      url: path,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log('res data: ', response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.${fileType}`);
      document.body.appendChild(link);
      link.click();
    });
  }

  async getCalculationInfo(guidCalculation) {
    const config = {
      params: {
        guidCalculation: guidCalculation,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Calculation/GetCalculationInfo`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetChatsExcel(companyId, startDate, endDate) {
    const body = {
      idCompany: companyId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    const config = {};

    try {
      axios({
        url: `${globalConfig.config.common.api}Projects/GetChatsExcel`,
        method: 'POST',
        responseType: 'blob',
        data: body,
        withCredentials: true,
      }).then((response) => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        const fileName = `Выборка_от_${formattedDate}.xlsx`;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetActiveCompanyUsers(companyId) {
    const config = {
      params: {
        companyId: companyId,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Users/GetActiveCompanyUsers`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async LoginByUserGuid(userGuid) {
    const config = {
      params: {
        guid: userGuid,
        clientId: globalConfig.config.auth.client_id,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Users/LoginByUserGuid`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async GetCalculationViews(guid) {
    const config = {
      params: {
        guid: guid,
      },
    };

    try {
      const response = await instance.get(
        `${globalConfig.config.common.api}Calculation/GetCalculationViews`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
