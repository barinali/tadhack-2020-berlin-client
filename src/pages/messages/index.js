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
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import { blue } from '@material-ui/core/colors';
import {
  Link as RouterLink
} from "react-router-dom";

import api from '../../helpers/api';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  chatSection: {
    flexGrow: 1,
    height: '100%',
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '84vh',
    overflowY: 'auto'
  },
  blue: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    fontSize: '1rem'
  }
}));

const takeInitials = (name) => {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
};

const isSenderStudent = (message) => {
  return message.sender.type === 'Student';
}

const Messages = ({ match }) => {
  const { studentId = undefined } = match.params;
  const classes = useStyles();
  const [students, setStudents] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const bottomRef = React.useRef(null);

  const fetchAndSetStudents = async () => {
    const { data } = await api.fetchStudents();

    setStudents(data);
  };

  const fetchAndSetMessages = async () => {
    const { data } = await api.fetchMessages();

    setMessages(data);

    // bottomRef.current.scrollIntoViewIfNeeded();
  };

  const shortPooler = () => {
    return setInterval(fetchAndSetMessages, 5000);
  }

  React.useEffect(() => {
    fetchAndSetStudents();
    fetchAndSetMessages();

    bottomRef.current.scrollIntoViewIfNeeded();

    const intervalId = shortPooler();

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const messagesToDisplay = messages.filter((message) => {
    if (studentId === undefined) {
      return message;
    }

    // debugger;
    if (message.sender.type === 'Student' && message.sender.id == studentId) {
      return message;
    } else if (message.sender.type === 'Teacher') {
      return message;
    }
  });

  const sendMessage = async () => {
    const payload = {
      content: message,
      receiver_id: students[0].id,
      receiver_type: 'Student',
      sender_id: 1,
      sender_type: 'Teacher',
    };
    setMessage('');

    await api.sendMessage(payload);
    await fetchAndSetMessages();
  }

  const keyDownHandler = async (event) => {
    console.log(event);
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  return (
    <div>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <Link component={RouterLink} to="/" color="textPrimary">
              <ListItem button key="TheTeacher">
                <ListItemAvatar>
                  <Avatar className={classes.blue} alt="The teacher">TT</Avatar>
                </ListItemAvatar>
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
              <Link key={student.id} component={RouterLink} to={`/${student.id}`} color="textPrimary">
                <ListItem button key={student.id}>
                  <ListItemAvatar>
                    <Avatar className={classes.blue} alt={student.name}>{takeInitials(student.name)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={student.name}>{student.name}</ListItemText>
                </ListItem>
              </Link>
            ))}
          </List>
        </Grid>
        <Grid item xs={9} style={{height: '100%'}}>
          <List className={classes.messageArea}>
            {messagesToDisplay.map((message) => (
              <ListItem key={message.id} style={{flexDirection: isSenderStudent(message) ? 'row': 'row-reverse'}}>
                <ListItemAvatar align={isSenderStudent(message) ? 'left' : 'right'}>
                  <Avatar className={classes.blue} alt={message.sender.name}>{takeInitials(message.sender.name)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  align={isSenderStudent(message) ? 'left' : 'right'}
                  primary={message.content}
                  secondary={formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                />
              </ListItem>
            ))}
            <div ref={bottomRef} />
          </List>
          <Divider />
          <Grid container style={{ padding: '20px' }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                onKeyDown={keyDownHandler}
                fullWidth
                value={message}
                onChange={(event) => {
                  const value = event.target.value;

                  setMessage(value);
                }}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add" onClick={sendMessage}><SendIcon /></Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Messages;
