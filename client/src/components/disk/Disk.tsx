import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { useEffect, useState } from 'react';
import { createDir, getFiles } from '../../actions/file';
import FileList from './fileList/FileList';

const Disk = () => {
	const [open, setOpen] = useState(false);

	const dispatch = useAppDispatch();
	const currentDir = useAppSelector((state) => state.files.currentDir);

	useEffect(() => {
		dispatch(getFiles(currentDir));
	}, [currentDir, dispatch]);

	const handleTogglePopup = () => {
		setOpen((open) => !open);
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={handleTogglePopup}
				PaperProps={{
					component: 'form',
					onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
						event.preventDefault();
						const formData = new FormData(event.currentTarget);
						const formJson: { [key: string]: string } = {};
						formData.forEach((value, key) => {
							formJson[key] = value.toString();
						});
						dispatch(createDir(currentDir, formJson.name));
						handleTogglePopup();
					},
				}}
			>
				<DialogTitle>Create new folder</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						required
						margin='dense'
						id='name'
						name='name'
						label='Folder name'
						type='text'
						fullWidth
						variant='standard'
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleTogglePopup}>Cancel</Button>
					<Button type='submit'>Create</Button>
				</DialogActions>
			</Dialog>
			<Box maxWidth='md' marginInline='auto'>
				<Typography
					variant='h5'
					component='h1'
					sx={{ mb: 3, textAlign: 'center' }}
				>
					Your Files
				</Typography>
				<Grid container sx={{ mb: 3 }}>
					<Grid item xs={6} sx={{ display: 'flex' }}>
						<Button
							sx={{ mr: 2 }}
							color='primary'
							size='large'
							variant='outlined'
						>
							Back
						</Button>
						<Button
							onClick={handleTogglePopup}
							color='primary'
							size='large'
							variant='outlined'
						>
							Create Folder
						</Button>
					</Grid>
					<Grid
						item
						xs={6}
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}
					>
						Sort
					</Grid>
				</Grid>

				<FileList />
			</Box>
		</>
	);
};

export default Disk;