import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function FormControlLabelPlacement(props) {

  const handleClick = (e) => {
    props.onChangeType(e.target.value);
  };

  return (
    <div className='view-start'>
    <FormControl component="fieldset">
      <FormLabel component="legend">Вид старта:</FormLabel>
      <RadioGroup row aria-label="position" name="position" defaultValue="Graphics">
        <FormControlLabel
          value="Graphics"
          control={<Radio color="primary" />}
          label="Графика"
          labelPlacement="bottom"
          onClick={handleClick}
        />
        <FormControlLabel
          value="Chat"
          control={<Radio color="primary" />}
          label="Переписка"
          labelPlacement="bottom"
          onClick={handleClick}
        />
        <FormControlLabel
          value="Stories"
          control={<Radio color="primary" />}
          label="Сторис"
          labelPlacement="bottom"
          onClick={handleClick}
        />
        <FormControlLabel
          value="3D"
          control={<Radio color="primary" />}
          label="3D"
          labelPlacement="bottom"
          onClick={handleClick}
        />
        <FormControlLabel
          value="Guide"
          control={<Radio color="primary" />}
          label="3D ХГ"
          labelPlacement="bottom"
          onClick={handleClick}
          disabled={props.actorOpen}
        />
      </RadioGroup>
    </FormControl>
    </div>
  );
}