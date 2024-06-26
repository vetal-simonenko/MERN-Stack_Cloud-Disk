import { Grid } from '@mui/material';
import File from './file/FileListItem';
import { useAppSelector } from '../../../reducers/hooks';
import { TFile } from '../../../libs/definitions';

const FileList = () => {
	const files: TFile[] = useAppSelector((state) => state.files.files);

	if (files.length === 0) {
		return <div>Files not found...</div>;
	}

	return (
		<>
			<Grid container sx={{ p: 2 }}>
				<Grid item xs={7}>
					Name
				</Grid>
				<Grid
					item
					xs={2}
					sx={{ display: 'flex', justifyContent: 'flex-end' }}
				>
					Date
				</Grid>
				<Grid
					item
					xs={3}
					sx={{ display: 'flex', justifyContent: 'flex-end' }}
				>
					Size
				</Grid>
			</Grid>
			{files.map((file) => (
				<File file={file} key={file._id} />
			))}
		</>
	);
};

export default FileList;
