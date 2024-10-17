import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Network from './Requests';
import { useDispatch, useSelector } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CirclePicker } from 'react-color';
import { setGroupsStore } from '../store/reducers/saveGuids';
import TransitionsGroup from './TransitionsGroup';
import { setGroupUpdate } from '../store/reducers/projectSlice';

export default function GroupChat(props) {
  const [user, setUser] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = React.useState([]);
  const [activeGroup, setActiveGroup] = React.useState();
  const [nameGroup, setNameGroup] = React.useState('');
  const [projects, setProjects] = React.useState([]);
  const [allProjects, setAllProjects] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [deleteGroup, setDeleteGroup] = React.useState(false);
  const [openSave, setOpenSave] = React.useState(false);
  const companyId = useSelector((state) => state.project.companyId);
  const groupUpdate = useSelector((state) => state.project.groupUpdate);
  const userGuid = useSelector((state) => state?.guids?.userGuid);
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
  const [color, setColor] = React.useState('#f44336');
  const [isCrmFolder, setCrmFolder] = React.useState(false);
  const [openCrmDeleteForm, setOpenCrmDeleteForm] = React.useState(false);
  const [openOrderForm, setOpenOrderForm] = React.useState(false);
  const [personalLabelIsDisabled, setPersonalLabelIsDisabled] = React.useState(false);
  const [companyDisabled, setCompanyDisabled] = React.useState(false);
  const [limit, setLimit] = React.useState(15);
  const chatsEl = React.useRef(null);
  const chatsBlockEl = React.useRef(null);

  const dispatch = useDispatch();

  const deleteArray = (array, guid) => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.guid == guid) {
        array.splice(index, 1);
        return element;
      }
    }
  };

  const deleteArrayAllProjects = (array, guid) => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.guid == guid) {
        array.splice(index, 1);
        return element;
      }
    }
  };

  const getData = async () => {
    if (
      typeof groupUpdate === 'object' &&
      groupUpdate !== null &&
      groupUpdate?.setProject == true
    ) {
      let projects = await new Network().GetByGuidGroup(groupUpdate?.group?.guid, companyId);
      props.onSetGroup(projects, true, groupUpdate?.group);
    } else {
      if (companyId != 'null' && companyId) {
        let group = await new Network().GetGroups(companyId);
        setUser(userGuid);
        setGroups(group);
        props.onSetGroup(group);
        dispatch(setGroupsStore(group));
      }
    }
  };

  useEffect(() => {
    getData();
  }, [companyId]);

  useEffect(() => {
    getData();
  }, [groupUpdate]);

  const handleOpen = () => {
    setOpen(true);
    setActiveStep(0);
  };

  const handleClose = () => {
    setOpen(false);
    setPersonalLabelIsDisabled(false);
    setValue('personal');
    setChecked(false);
    setCrmCheckboxDisabled(false);
    setCompanyDisabled(false);
    setAllProjects([]);
  };

  const handleCloseSave = () => {
    setOpenSave(false);
  };

  const handleCloseCrmDeleteForm = () => {
    setOpenCrmDeleteForm(false);
  };

  const handleDeletePopup = () => {
    if (isCrmFolder) {
      setOpenCrmDeleteForm(true);
    } else {
      if (projects.length == 0) {
        setOpenSave(true);
      } else {
        alert('В данной папке есть чаты');
      }
    }
  };

  const handleNewGroup = async () => {
    //Временно убираю лимит
    const availableProjects = await new Network().GetProjectsToManageGroups(
      companyId,
      null,
      false,
      null,
      null,
    );
    setAllProjects(availableProjects);
    setActiveGroup();
    setNameGroup('');
    setProjects([]);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep != 2) {
      setPersonalLabelIsDisabled(false);
      setValue('personal');
      setChecked(false);
      setCrmCheckboxDisabled(false);
      setCompanyDisabled(false);
      setAllProjects([]);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCrmFolder(false);
    setOpenOrderForm(false);
  };

  const handleAddProjects = async () => {
    for (let index = 0; index < projects.length; index++) {
      const element = projects[index];
      let el = deleteArrayAllProjects(allProjects, element.guid);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleComplete = async () => {
    let guids = [];
    let newGroup = true;

    for (let index = 0; index < projects.length; index++) {
      const element = projects[index];
      guids.push(element.guid);
    }

    for (let index = 0; index < groups.length; index++) {
      const element = groups[index];
      if (element.guid == activeGroup) {
        const copyGroup = { ...groups[index] };
        copyGroup.name = nameGroup;
        newGroup = false;
      }
    }
    if (newGroup) {
        if (nameGroup.length < 1) {
        alert('Введите имя группы');
        return;
      }

      let response;
      if (value == 'company') {
        if (checked) {
          let group = groups.filter((group) => group.name == nameGroup);
          if (group.length != 0) {
            alert(`CRM группа с названием ${nameGroup} уже существует`);
            return;
          }
        }
        response = await new Network().AddGroup(nameGroup, null, companyId, checked, color);
      } else {
        response = await new Network().AddGroup(nameGroup, user, companyId, false, color);
      }
      if (projects.length > 0) {
        await new Network().UpdateProjectsInGroup(guids, response.guid);
      } else {
        alert('В папке должен находиться как минимум 1 проект.');
      }

      props.onSetGroup([...groups, response]);
      setGroups([...groups, response]);
    } else {
      let crmGroup = groups.find((group) => group.guid == activeGroup);
      if (projects.length > 0 && checked && crmGroup != undefined && !crmGroup.isCRM) {
        alert('Невозможно сохранить папку как CRM, т.к в ней находятся проекты');
      } else {
        await new Network().UpdateProjectsInGroup(guids, activeGroup);
        const updatedGroup = await new Network().UpdateGroup(
          activeGroup,
          nameGroup,
          color,
          checked,
        );
        dispatch(setGroupUpdate(updatedGroup));
        props.onSetGroup(groups, true, updatedGroup);
      }

      setPersonalLabelIsDisabled(false);
      setCompanyDisabled(false);
      setValue('personal');
      setChecked(false);
      setCrmCheckboxDisabled(false);
    }

    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClickGroup = async (guid, user, name, color, isCrm) => {
    if (user == null) {
      setValue('company');
      setPersonalLabelIsDisabled(true);
      if (isCrm) {
        setChecked(true);
        setCrmFolder(true);
        setPersonalLabelIsDisabled(true);
        setCrmCheckboxDisabled(true);
      }
    } else {
      setCompanyDisabled(true);
    }
    let existingProjects = await new Network().GetProjectsToManageGroups(companyId, guid, true);
    //Временно убираю лимит
    const availableProjects = await new Network().GetProjectsToManageGroups(
      companyId,
      guid,
      false,
      null,
      null,
    );
    setAllProjects(availableProjects);
    setDeleteGroup(true);
    setNameGroup(name);
    setColor(color);
    setActiveGroup(guid);
    setProjects(existingProjects);
    setAllProjects(availableProjects);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleDelete = (e) => {
    let el = deleteArray(projects, e);
    setAllProjects([el, ...allProjects]);
  };

  const handleDeleteGroup = async (e) => {
    let deleteGroup = await new Network().DeleteGroup(activeGroup);
    if (deleteGroup == undefined) {
      alert('Невозможно удалить, в папке находятся чаты');
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      setOpenSave(false);
      return;
    }
    setProjects([]);
    let updatedGroups = groups.filter((group) => group.guid != deleteGroup?.guid);
    setGroups(updatedGroups);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setOpenSave(false);
    setPersonalLabelIsDisabled(false);
    setCompanyDisabled(false);
    setValue('personal');
    setChecked(false);
    setCrmCheckboxDisabled(false);
    props.onSetGroup(updatedGroups);
  };

  const handleDeleteCrmFolders = async () => {
    try {
      const deleted = await new Network().DeleteCRMGroupsForCompany(companyId);
      let updatedGroups = groups.filter((group) => !group.isCRM);
      setGroups(updatedGroups);
      props.onSetGroup(updatedGroups);
    } catch (error) {
      alert('Удаление невозможно, в папках находятся проекты');
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setOpenCrmDeleteForm(false);
    setPersonalLabelIsDisabled(false);
    setCompanyDisabled(false);
    setValue('personal');
    setChecked(false);
    setCrmCheckboxDisabled(false);
  };

  const handleAdd = (e) => {
    let el = deleteArrayAllProjects(allProjects, e);
    setProjects([...projects, el]);
  };

  const changeName = (e) => {
    setNameGroup(e.target.value);
  };

  const [value, setValue] = React.useState('personal');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [checked, setChecked] = React.useState(false);
  const [crmCheckboxDisabled, setCrmCheckboxDisabled] = React.useState(false);

  const handleChangeCheckbox = (event) => {
    setChecked(event.target.checked);
  };

  const addTemplateCrm = async () => {
    await new Network().AddCRMGroupsTemplate(companyId);

    let groups = await new Network().GetGroups(companyId);
    setGroups(groups);
    props.onSetGroup(groups);
  };

  const addTemplatePersonal = async () => {
    let response = await new Network().AddGroup('Личное', user, companyId, false, color);
    let group = await new Network().GetGroups(companyId);
    props.onSetGroup([...groups, response]);
    setGroups(group);
  };

  const clickSwatch = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const closeSwatch = () => {
    setDisplayColorPicker(false);
  };

  const changeColor = (color) => {
    setColor(color.hex);
  };

  const handleOrderForm = async () => {
    setActiveStep((prevState) => prevState + 1);
    setOpenOrderForm(true);
  };

  const scrollProjects = async () => {
    const scrollElement = chatsEl.current.getBoundingClientRect();
    const scrollView = chatsBlockEl.current.getBoundingClientRect();
    if (scrollElement.bottom > scrollView.top) {
      let projectsFetched = [];
      chatsEl.current.removeEventListener('scroll', scrollProjects);
      projectsFetched = await new Network().GetProjectsToManageGroups(
        companyId,
        activeGroup === '' ? null : activeGroup,
        false,
        allProjects[allProjects.length - 1].id,
        allProjects[allProjects.length - 1].timestamp,
        limit,
      );
      let projectsFiltered = projectsFetched.filter(
        (pr) => !projects.map((b) => b.guid).includes(pr.guid),
      );
      if (projectsFetched.length > 0) {
        setAllProjects((prevState) => [...prevState, ...projectsFiltered]);
      }
    }
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <div className="group-add" onClick={handleNewGroup}>
              + Новая папка
            </div>
            <div className="group-crm--order" onClick={handleOrderForm}>
              Порядок
            </div>
            <div className="group-list">
              <div className="group-title">Папки</div>
              {groups.map((gr) => {
                return (
                  <div
                    className="group-item"
                    onClick={() =>
                      handleClickGroup(gr.guid, gr.guidUser, gr.name, gr.color, gr.isCRM)
                    }>
                    <div className="group-color" style={{ backgroundColor: gr.color }}></div>
                    <div className="group-tag">{gr.name}</div>
                  </div>
                );
              })}
            </div>
            <div className="group-list">
              <div className="group-title group-title--marg">Рекомендованные</div>
              <div className="group-row group-row--nb">
                <div className="">Личное</div>
                <div className="group-add" onClick={addTemplatePersonal}>
                  + Добавить
                </div>
              </div>
              {companyId != null && (
                <div className="group-row group-row--nb">
                  <div>Набор CRM папок</div>
                  <div className="group-add" onClick={addTemplateCrm}>
                    + Добавить
                  </div>
                </div>
              )}
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="group-button">
              <div className="group-back" onClick={handleBack}></div>
              {!openOrderForm && (
                <div className={deleteGroup ? 'with-delete' : 'without-delete'}>
                  <div className="group-complete" onClick={handleComplete}></div>
                  {deleteGroup && <div className="group-delete" onClick={handleDeletePopup}></div>}
                </div>
              )}
            </div>
            {!openOrderForm ? (
              <>
                <input
                  type="text"
                  name="chat"
                  onChange={(e) => changeName(e)}
                  placeholder="Название папки"
                  value={nameGroup}
                  autoComplete="off"
                  className="group-input"
                />
                <div className="group-row">
                  <FormControl component="fieldset">
                    <FormLabel component="legend"></FormLabel>
                    <RadioGroup
                      className="radio-row"
                      aria-label="gender"
                      name=""
                      value={value}
                      onChange={handleChange}>
                      <FormControlLabel
                        disabled={personalLabelIsDisabled}
                        className="radio-item"
                        value="personal"
                        control={<Radio />}
                        label="Личная"
                      />
                      {companyId != null && (
                        <FormControlLabel
                          className="radio-item"
                          disabled={companyDisabled}
                          value="company"
                          control={<Radio />}
                          label="Компании"
                        />
                      )}
                    </RadioGroup>
                  </FormControl>
                  <div className="color-picker" onClick={clickSwatch}>
                    <div>Цвет</div>
                    <div>
                      <div className="swatch">
                        <div
                          className="color"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      </div>
                      {displayColorPicker ? (
                        <div className="popover">
                          <div className="cover" onClick={closeSwatch} />
                          <CirclePicker onChange={changeColor} color={color} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                {value == 'company' && (
                  <div className="checkbox-form">
                    <Checkbox
                      checked={checked}
                      disabled={crmCheckboxDisabled}
                      onChange={handleChangeCheckbox}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span>CRM</span>
                  </div>
                )}

                <div className="chat-list header">
                  <div className="group-row">
                    <div className="group-title">Проекты</div>
                    <div className="group-add" onClick={handleAddProjects}>
                      {activeGroup != null ? 'Добавить/удалить проекты' : '+ Добавить проекты'}
                    </div>
                  </div>
                </div>
                <div className="chat-list list">
                  {projects.map((pr) => {
                    return <div className="chat-list--item">{pr.name}</div>;
                  })}
                </div>
              </>
            ) : (
              <TransitionsGroup></TransitionsGroup>
            )}
          </>
        );
      case 2:
        return (
          <>
            <div className="group-button">
              <div className="group-back" onClick={handleBack}></div>
            </div>
            <div className="chat-delete-list">
              {projects.map((pr) => {
                return (
                  <div className="chat-list--item" onClick={() => handleDelete(pr.guid)}>
                    {pr.name}
                  </div>
                );
              })}
            </div>
            <div className="group-title">Проекты</div>
            <div className="chat-list available" ref={chatsEl}>
              {allProjects.map((pr) => {
                return (
                  <div className="chat-list--item" onClick={() => handleAdd(pr.guid)}>
                    {pr.name}
                  </div>
                );
              })}
              <div className="load-block-project" ref={chatsBlockEl}></div>
            </div>
          </>
        );
      default:
        return 'Unknown stepIndex';
    }
  }

  return (
    <div>
      <Button className="bm-item menu-item" onClick={handleOpen}>
        Папки с проектами
      </Button>
      <Dialog open={open} keepMounted onClose={handleClose} className="group-projects">
        <DialogContent>
          <div className="group">{getStepContent(activeStep)}</div>
        </DialogContent>
      </Dialog>
      <Dialog open={openSave} keepMounted onClose={handleCloseSave} className="group-projects">
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить группу?
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleDeleteGroup} color="primary">
              Да
            </Button>
            <Button onClick={handleCloseSave} color="primary">
              Нет
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openCrmDeleteForm}
        keepMounted
        onClose={handleCloseCrmDeleteForm}
        className="group-projects">
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Возможно удалить только все CRM-папки, вы хотите удалить все папки?
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleDeleteCrmFolders} color="primary">
              Да
            </Button>
            <Button onClick={handleCloseCrmDeleteForm} color="primary">
              Нет
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
