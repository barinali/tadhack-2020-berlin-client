import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  Link as RouterLink
} from "react-router-dom";

import api from '../../helpers/api';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    paddingTop: '1rem',
  },
  form: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  }
}));

export default function StudentList() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [name, setStudentName] = React.useState('');
  const [phoneNumber, setStudentPhoneNumber] = React.useState('');

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const addStudent = async () => {
    await api.addStudent({ name, phone_number: phoneNumber });
    await fetchAndSetStudents();
  }

  const fetchAndSetStudents = async () => {
    const { data } = await api.fetchStudents();

    setStudents(data);
  };

  const deleteStudents = async () => {
    await api.deleteStudents(checked);

    await fetchAndSetStudents();
  };

  React.useEffect(() => {
    fetchAndSetStudents();
  }, []);

  return (
    <>
      <Container maxWidth="lg" className={classes.container}>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom={true}>Students</Typography>

            <List className={classes.root}>
              {students.map((student) => {
                return (
                  <ListItem key={student.id} role={undefined} dense button onClick={handleToggle(student.id)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(student.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': student.id }}
                      />
                    </ListItemIcon>
                    <ListItemText id={student.id} primary={student.name} secondary={student.phone_number} />
                  </ListItem>
                );
              })}
            </List>

            <Button variant="contained" color="primary" onClick={deleteStudents}>
              Delete selected students
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom={true}>Add a student</Typography>

            <form className={classes.form} noValidate autoComplete="off">
              <TextField
                id="standard-basic"
                label="Student name"
                fullWidth
                onChange={(event) => {
                  const value = event.target.value;

                  setStudentName(value);
                }}
              />

              <TextField
                id="standard-basic"
                label="Phone number"
                fullWidth
                onChange={(event) => {
                  const value = event.target.value;

                  setStudentPhoneNumber(value);
                }}
              />

              <Button variant="contained" color="primary" onClick={addStudent}>
                Add
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}