import React, {useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import Network from "./Requests";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";


const TransitionsGroup = (props) => {
  const [rows, setRows] = React.useState([]);
  const [selectedFrom, setSelectedFrom] = React.useState(null);
  const [selectedTo, setSelectedTo] = React.useState(null);
  const [showCheckBoxes, setShowCheckBoxes] = React.useState(false);
  const [transitions, setTransitions] = React.useState([]);
  const [transitionForDelete, setTransitionForDelete] = React.useState(null);
  const [isSelected, setIsSelected] = React.useState();
  const addRowEl = useRef(null);
  const deleteRowEl = useRef(null);
  const saveRowEl = useRef(null);

  const groups = useSelector((state) => state?.guids?.groups);
  const companyId = useSelector((state) => state.project.companyId);


  const getData = async () => {
    if (companyId != 'null' && companyId != undefined) {
      let transitions = await new Network().GetAllTransitions(companyId);
      setTransitions(transitions);
    }
  }
  useEffect(() => {
    getData();
  }, [companyId]);


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const changeToState = (event) => {
    setSelectedTo(event.target.value);
  }

  const changeFromState = (event) => {
    setSelectedFrom(event.target.value)
  }

  const handleAddRow = () => {
    addRowEl.current.classList.toggle('hidden');
    deleteRowEl.current.classList.toggle('hidden');
    const row = addStateRow();
    setRows(prevState => [...prevState, row]);
  }

  const handleDeleteRow = async () => {
    if (transitionForDelete == null) {
      setShowCheckBoxes(true);
      addRowEl.current.classList.toggle('hidden');
      saveRowEl.current.classList.toggle('hidden');
      if (showCheckBoxes == true) {
        setShowCheckBoxes(false);
      }
      return;
    }
    const deleted = await new Network().DeleteTransition(transitionForDelete)
    setTransitionForDelete(null);
    setShowCheckBoxes(false);
    setIsSelected(null);
    setTransitions(transitions.filter(item => item.id != deleted.id));
    addRowEl.current.classList.toggle('hidden');
    saveRowEl.current.classList.toggle('hidden');
  }

  const saveTransition = async () => {
    if (selectedFrom == '' || selectedTo == '') {
      alert('Выберите начальный и конечный статус');
      return;
    }
    if (selectedFrom == selectedTo) {
      alert('Невозможно выполнить переход из одинаковых папок.')
    }
    const transition = await new Network().AddTransition(selectedFrom, selectedTo);
    setTransitions(prevState => [...prevState, transition]);
    setRows([]);
    addRowEl.current.classList.toggle('hidden');
    deleteRowEl.current.classList.toggle('hidden');
  }

  const setDeleteCheckbox = (idTransition) => {
    if (!isSelected) {
      setTransitionForDelete(idTransition);
      setIsSelected(idTransition);
    } else {
      setIsSelected(null);
      setTransitionForDelete(null);
    }
  }

  const addStateRow = () => {
    return (
      <div className="state-table--content">
        <div className="state-table--row">
          <FormControl className="select-form">
            <Select
              defaultValue={selectedFrom}
              onChange={changeFromState}
              displayEmpty
              label="Состояние"
              className="select-label"
              MenuProps={MenuProps}>
              <MenuItem value={null}>Все</MenuItem>
              {groups?.filter((group) => group.isCRM).map((g) => {
                return <MenuItem value={g.guid}>{g.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </div>
        <div className="state-table--row">
          <FormControl className="select-form">
            <Select
              defaultValue={selectedTo}
              onChange={changeToState}
              displayEmpty
              label="Состояние"
              className="select-label"
              MenuProps={MenuProps}>
              <MenuItem value={null}>Все</MenuItem>
              {groups?.filter((group) => group.isCRM).map((g) => {
                return <MenuItem value={g.guid}>{g.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="state-settings--header">
        <div className="group-add" onClick={handleAddRow} ref={addRowEl}>
          +Добавить
        </div>
        <div className="group-add" onClick={handleDeleteRow} ref={deleteRowEl}>
          -Удалить
        </div>
        <div className="group-add" onClick={saveTransition} ref={saveRowEl}>
          Сохранить
        </div>
      </div>
      <div className="state-table">
        <div className="state-table--header">
          <div className="state-table--column">
            Начальное состояние
          </div>
          <div className="state-table--column">
            Конечное состояние
          </div>
        </div>
        {transitions?.length > 0 && transitions
          .map((tr) => {
            return (
              <div className="state-table--content">
                {showCheckBoxes && <Checkbox
                  disabled={isSelected ? isSelected != tr?.id : false}
                  onChange={() => setDeleteCheckbox(tr?.id)}></Checkbox>
                }
                <div className="state-table--row">
                  <FormControl className="select-form">
                    <InputLabel id="demo-simple-select-standard-label">{tr?.fromGroup?.name == null ? 'Все'  : tr?.fromGroup?.name}</InputLabel>
                  </FormControl>
                </div>
                <div className="state-table--row">
                  <FormControl className="select-form">
                    <InputLabel id="demo-simple-select-standard-label">{tr?.toGroup?.name == null ? 'Все' : tr?.toGroup?.name}</InputLabel>
                  </FormControl>
                </div>
              </div>
            )
          })}
        {rows}
      </div>
    </>
  )

}
export default TransitionsGroup;