import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import uuidv4 from 'uuid/v4';
import { Team } from '../models/team';

const TeamController = express.Router();
// const upload = multer({
//   dest: '/public '
// });

TeamController.get('/', (req, res) => {
  Team.find({}).then((userList) => {
    res.status(200).json(userList);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

TeamController.get('/:id', async (req, res) => {
  Team.findById(req.params.id).then((team) => {
    res.status(200).json(team);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

TeamController.post('/', (req, res) => {
  const newTeam = new Team(req.body);
  newTeam.save().then(() => {
    res.status(200).send('Create new team successfully!');
  }).catch((error) => {
    res.status(500).send(error);
  });
});

TeamController.put('/:id', (req, res) => {
  Team.findOneAndReplace({ _id: id }, null);
});

TeamController.delete('/:id', (req, res) => {
  Team.findById(req.params.id, async (error, team) => {
    if (team) {
      await team.remove();
      res.status(200).send();
    } else {
      res.status(400).send('Team Cannot be found');
    }
  });
});

TeamController.delete('/:id/users/:userId', (req, res) => {

});

// TeamController.post('/team-icons', upload.single('teamIcon'), (req, res) => {
//   const imageId = uuidv4();
//   const filePath = req.file.path;
//   const targetPath = path.join(__dirname, '../uploads/team-icons/' + imageId.toString());

//   if (path.extname(req.file.originalname).toLowerCase() === '.png') {
//     fs.rename(filePath, targetPath, (err) => {
//       if (err) res.status(500).send(err);

//       res.status(200).send('Team Icon Uploaded!');
//     });
//   } else {
//     fs.unlink(filePath, (err) => {
//       if (err) res.status(500).send(err);

//       res.status(403).send('Only .png files are allowed!');
//     });
//   }
// });

export default TeamController;
