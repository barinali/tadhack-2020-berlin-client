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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import CallIcon from '@material-ui/icons/Call';
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

const createUnifierByCanonicalId = () => {
  const existingIds = [];

  return (message) => {
    const { canonical_id: canonicalId } = message;

    if (!existingIds.includes(canonicalId)) {
      existingIds.push(canonicalId);

      return false;
    }

    return true;
  }
};

const takeInitials = (name) => {
  if (!name) return '';

  return name.split(' ').map(w => w[0]).join('').toUpperCase();
};

const isSenderStudent = (message) => {
  return message.sender.type === 'Student';
}

const Messages = ({ match }) => {
  const { studentId = undefined } = match.params;
  const classes = useStyles();
  const [students, setStudents] = React.useState([]);
  const [studentList, setStudentList] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [teacher, setTeacher] = React.useState({});

  const bottomRef = React.useRef(null);

  const fetchAndSetTeacher = async () => {
    const { data } = await api.fetchTeachers();

    setTeacher(data[0]);
  };

  const fetchAndSetStudents = async () => {
    const { data } = await api.fetchStudents();

    setStudents(data);
    setStudentList(data);
  };

  const fetchAndSetMessages = async () => {
    const { data } = await api.fetchMessages();

    setMessages(data);

    // bottomRef.current.scrollIntoViewIfNeeded();
  };

  const shortPooler = () => {
    return setInterval(fetchAndSetMessages, 5000);
  }

  const isCanonical = createUnifierByCanonicalId();

  const messagesToDisplay = messages.filter((message) => {
    if (isCanonical(message)) {
      return false;
    }

    if (studentId === undefined) {
      return message;
    }

    if (message.sender.type === 'Student' && message.sender.id == studentId) {
      return message;
    } else if (message.sender.type === 'Teacher') {
      return message;
    }
  });

  const messagesReference = messagesToDisplay.map(({ id }) => id).join('');

  const sendMessage = async () => {
    const studentIds = students.map(({ id }) => id);
    const payload = {
      content: message,
      receiver_id: studentIds,
      receiver_type: 'Student',
      sender_id: 1,
      sender_type: 'Teacher',
      message_type: 'text',
    };
    setMessage('');

    await api.sendMessage(payload);
    await fetchAndSetMessages();
  }

  const keyDownHandler = async (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  const initiateCall = (studentId) => {
    return async (event) => {
      event.preventDefault();

      const payload = {

      };
      await api.initiateCall(payload);
    }
  };

  const search = (event) => {
    const query = event.target.value.toLowerCase();

    const filteredStudents = students.filter((student) => {
      const {
        name,
        phone_number: phoneNumber
      } = student;

      if (name.toLowerCase().includes(query)) {
        return true;
      }

      if (phoneNumber.includes(query)) {
        return true;
      }

      return false;
    });

    setStudentList(filteredStudents);
  }

  React.useEffect(() => {
    fetchAndSetTeacher();
    fetchAndSetStudents();
    fetchAndSetMessages();

    bottomRef.current.scrollIntoViewIfNeeded();

    const intervalId = shortPooler();

    return () => {
      clearInterval(intervalId);
    }
  }, [messagesReference]);

  return (
    <div>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <Link component={RouterLink} to="/" color="textPrimary">
              <ListItem button key={teacher.name}>
                <ListItemAvatar>
                  <Avatar className={classes.blue} alt={teacher.name}>{takeInitials(teacher.name)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={teacher.name}></ListItemText>
              </ListItem>
            </Link>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: '10px' }}>
            <TextField id="outlined-basic-email" label="Search" variant="outlined" onChange={search} fullWidth />
          </Grid>
          <Divider />
          <List>
            {studentList.map((student) => (
              <Link key={student.id} component={RouterLink} to={`/${student.id}`} color="textPrimary">
                <ListItem button key={student.id}>
                  <ListItemAvatar>
                    <Avatar className={classes.blue} alt={student.name}>{takeInitials(student.name)}</Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText primary={student.name}>{student.name}</ListItemText>

                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="initiateCall" onClick={initiateCall(student.id)}>
                      <CallIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Link>
            ))}
          </List>
        </Grid>
        <Grid item xs={9} style={{height: '100%'}}>
          <List className={classes.messageArea}>
            {messagesToDisplay.map((message) => (
              <ListItem key={message.id} alignItems="flex-start" style={{flexDirection: isSenderStudent(message) ? 'row': 'row-reverse'}}>
                <ListItemAvatar align={isSenderStudent(message) ? 'left' : 'right'}>
                  <Avatar className={classes.blue} alt={message.sender.name}>{takeInitials(message.sender.name)}</Avatar>
                </ListItemAvatar>

                {message.message_type === 'text' &&
                  <ListItemText
                    align={isSenderStudent(message) ? 'left' : 'right'}
                    primary={message.content}
                    secondary={formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  />
                }

                {message.message_type === 'audio' &&
                  <ListItemText
                    align={isSenderStudent(message) ? 'left' : 'right'}
                    primary={<>
                      <audio controls>
                        <source src={message.audio_url} type="audio/mpeg" />
                      </audio>
                      <p>{message.content}</p>
                    </>}
                    secondary={formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  />
                }
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
