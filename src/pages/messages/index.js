import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import {
  Link as RouterLink
} from "react-router-dom";

import api from '../../helpers/api';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '100vh'
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '83vh',
    overflowY: 'auto'
  }
});

const Messages = ({ match }) => {
  const { studentId = undefined } = match.params;
  const classes = useStyles();
  const [students, setStudents] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
 
  const fetchAndSetStudents = async () => {
    const { data } = await api.fetchStudents();

    setStudents(data);
  };

  const fetchAndSetMessages = async () => {
    const { data } = await api.fetchMessages();

    setMessages(data);
  };

  React.useEffect(() => {
    fetchAndSetStudents();
    fetchAndSetMessages();
  }, []);

  const messagesToDisplay = messages.filter((message) => {
    if (message.sender_type === 'Student' && message.sender_id === studentId) {
      return message;
    } else if (message.sender_type === 'Teacher') {
      return message;
    }
  });

  return (
    <div>
      {/* <Grid container>
        <Grid item xs={12} >
          <Typography variant="h5" className="header-message">Chat</Typography>
        </Grid>
      </Grid> */}
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <Link component={RouterLink} to="/students" color="textPrimary">
              <ListItem button key="TheTecher">
                <ListItemIcon>
                  <Avatar alt="The teacher" src="http://placehold.it/128x128/00adef/ffffff?text=TT" />
                </ListItemIcon>
                <ListItemText primary="The teacher"></ListItemText>
              </ListItem>
            </Link>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: '10px' }}>
            <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
          </Grid>
          <Divider />
          <List>
            {students.map((student) => (
              <Link component={RouterLink} to={`/students/${student.id}`} color="textPrimary">
                <ListItem button key={student.id}>
                  <ListItemIcon>
                    <Avatar alt={student.name} src={`http://placehold.it/128x128/00adef/ffffff?text=${student.name.split(' ').map(w => w[0]).join('').toUpperCase()}`} />
                  </ListItemIcon>
                  <ListItemText primary={student.name}>{student.name}</ListItemText>
                </ListItem>
              </Link>
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          <List className={classes.messageArea}>
            {messagesToDisplay.map((message) => (
              <ListItem key={message.id}>
                <Grid container>
                  <Grid item xs={2}>
                    {/* <Avatar alt={message.sender.name} src={`http://placehold.it/128x128/00adef/ffffff?text=${message.sender.name.split(' ').map(w => w[0]).join('').toUpperCase()}`} /> */}
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      <ListItemText align={message.sender_type === 'Student' ? 'left' : 'right'} primary={message.content}></ListItemText>
                    </div>
                  {/* </Grid>
                  <Grid item xs={12}> */}
                    <div>
                      <ListItemText align={message.sender_type === 'Student' ? 'left' : 'right'} secondary={formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}></ListItemText>
                    </div>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
            {/* <ListItem key="2">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText align="left" primary="Hey, Iam Good! What about you ?"></ListItemText>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText align="left" secondary="09:31"></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem key="3">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText align="right" primary="Cool. i am good, let's catch up!"></ListItemText>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText align="right" secondary="10:30"></ListItemText>
                </Grid>
              </Grid>
            </ListItem> */}
          </List>
          <Divider />
          <Grid container style={{ padding: '20px' }}>
            <Grid item xs={11}>
              <TextField id="outlined-basic-email" label="Type Something" fullWidth />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add"><SendIcon /></Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Messages;
