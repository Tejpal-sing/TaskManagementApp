import * as React from "react";
import { createTheme } from "@mui/material/styles";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Crud } from "@toolpad/core/Crud";
import { DataModel, DataSource, DataSourceCache } from "@toolpad/core/Crud";
import { useDemoRouter } from "@toolpad/core/internal";
import axios from "axios";
import logo from "../assets/currentlogo.png";
import { Box, Button, Popover, styled } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const LogoButton = styled(Box)({
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	gap: 8,
	"&:hover": {
		opacity: 0.8,
	},
});

const LogoutPopover = styled(Popover)(({ theme }) => ({
	"& .MuiPopover-paper": {
		padding: theme.spacing(1),
		marginTop: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
		color: "white",
	},
}));

const LogoutButtonStyled = styled(Button)(({ theme }) => ({
	color: "white",
	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
	},
	"& .MuiSvgIcon-root": {
		color: "white",
	},
}));

const NAVIGATION: Navigation = [
	{
		segment: "Todolist",
		title: "TodoList",
		icon: <StickyNote2Icon />,
		pattern: "notes{/:noteId}*",
	},
];

const demoTheme = createTheme({
	cssVariables: {
		colorSchemeSelector: "data-toolpad-color-scheme",
	},
	colorSchemes: { light: true, dark: true },
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 600,
			lg: 1200,
			xl: 1536,
		},
	},
});

export interface Note extends DataModel {
	id: number;
	title: string;
	body: string;
}


export const notesDataSource: DataSource<Note> = {
	fields: [
		{ field: "id", headerName: "TodoID" },
		{ field: "title", headerName: "Title", flex: 1 },
		{ field: "body", headerName: "Body", flex: 1 },
	],

	getMany: async ({ paginationModel, filterModel, sortModel }) => {
		try {
			const accessToken = localStorage.getItem("accessToken");

			const response = await axios.get(
				"http://localhost:8000/api/todos/retrieveUserData",
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: "application/json",
					},
					params: {
						page: paginationModel.page,
						limit: paginationModel.pageSize,
					},
				},
			);
			console.log(response);
			const allNotes = response.data;
			console.log(allNotes);

			let processedNotes = [...allNotes.data.items];

			// Apply filters (client-side)
			if (filterModel?.items?.length) {
				for (const { field, value, operator } of filterModel.items) {
					if (!field || value == null) return;

					processedNotes = processedNotes.filter((note) => {
						const noteValue = note[field];

						switch (operator) {
							case "contains":
								return String(noteValue)
									.toLowerCase()
									.includes(String(value).toLowerCase());
							case "equals":
								return noteValue === value;
							case "startsWith":
								return String(noteValue)
									.toLowerCase()
									.startsWith(String(value).toLowerCase());
							case "endsWith":
								return String(noteValue)
									.toLowerCase()
									.endsWith(String(value).toLowerCase());
							case ">":
								return (noteValue as number) > value;
							case "<":
								return (noteValue as number) < value;
							default:
								return true;
						}
					});
				}
			}

			// Apply sorting
			if (sortModel?.length) {
				processedNotes.sort((a, b) => {
					for (const { field, sort } of sortModel) {
						if ((a[field] as number) < (b[field] as number))
							return sort === "asc" ? -1 : 1;
						if ((a[field] as number) > (b[field] as number))
							return sort === "asc" ? 1 : -1;
					}
					return 0;
				});
			}

			return {
				items: processedNotes,
				itemCount: allNotes.data.totalCount,
			};
		} catch (error) {
			console.error("Error fetching notes:", error);
			throw error;
		}
	},

	getOne: async (noteId) => {
		try {
			const accessToken = localStorage.getItem("accessToken");

			const res = await axios.get(
				`http://localhost:8000/api/todos/retrieve/${noteId}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return res.data[0];
		} catch (error) {
			console.error("Error fetching note:", error);
			throw error;
		}
	},

	createOne: async (data) => {
		try {
			const accessToken = localStorage.getItem("accessToken");

			const res = await axios.post(
				`http://localhost:8000/api/todos/create`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return res.data;
		} catch (error) {
			console.error("Error creating todo:", error);
			throw error;
		}
	},

	updateOne: async (noteId, data) => {
		try {
			const accessToken = localStorage.getItem("accessToken");
			console.log("noteID is:", noteId);
			const response = await axios.put(
				`http://localhost:8000/api/todos/update/${noteId}`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.data;
		} catch (error) {
			console.error("Error updating todo:", error);
			throw error;
		}
	},

	deleteOne: async (noteId) => {
		try {
			const accessToken = localStorage.getItem("accessToken");

			const res = await axios.delete(
				`http://localhost:8000/api/todos/delete/${noteId}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: "application/json",
					},
				},
			);

			return res.data; // Optionally return a message from backend
		} catch (error) {
			console.error("Error deleting todo:", error);
			throw error;
		}
	},

	validate: (formValues) => {
		let issues: { message: string; path: [keyof Note] }[] = [];

		if (!formValues.title) {
			issues = [...issues, { message: "Title is required", path: ["title"] }];
		}

		if (formValues.title && formValues.title.length < 3) {
			issues = [
				...issues,
				{
					message: "Title must be at least 3 characters long",
					path: ["title"],
				},
			];
		}

		if (!formValues.body) {
			issues = [...issues, { message: "body is required", path: ["body"] }];
		}

		return { issues };
	},
};

const notesCache = new DataSourceCache();

function matchPath(pattern: string, pathname: string): string | null {
	const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, "([^/]+)")}$`);
	const match = pathname.match(regex);
	return match ? match[1] : null;
}

interface DemoProps {
	window?: () => Window;
}

export default function CrudBasic(props: DemoProps) {
	const { window } = props;
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

	const handleLogoClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		navigate("/signin");
		handlePopoverClose();
	};

	const open = Boolean(anchorEl);

	const router = useDemoRouter("/notes");

	const demoWindow = window !== undefined ? window() : undefined;

	const title = React.useMemo(() => {
		if (router.pathname === "/notes/new") {
			return "New Note";
		}
		const editNoteId = matchPath("/notes/:noteId/edit", router.pathname);
		if (editNoteId) {
			return `Note ${editNoteId} - Edit`;
		}
		const showNoteId = matchPath("/notes/:noteId", router.pathname);
		if (showNoteId) {
			return `Note ${showNoteId}`;
		}

		return undefined;
	}, [router.pathname]);

	return (
			<AppProvider
				navigation={NAVIGATION}
				router={router}
				theme={demoTheme}
				window={demoWindow}
				branding={{
					title: "TodoApp",
					logo: (
						<LogoButton onClick={handleLogoClick}>
							<Box
								component="img"
								src={logo}
								alt="Logo"
								sx={{ width: 40, height: 40 }}
							/>
						</LogoButton>
					),
				}}
			>
				<LogoutPopover
					open={open}
					anchorEl={anchorEl}
					onClose={handlePopoverClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
				>
					<LogoutButtonStyled
						startIcon={<LogoutIcon />}
						onClick={handleLogout}
						fullWidth
					>
						Logout
					</LogoutButtonStyled>
				</LogoutPopover>
				<DashboardLayout defaultSidebarCollapsed>
					<PageContainer title={title}>
						<Crud<Note>
							dataSource={notesDataSource}
							dataSourceCache={notesCache}
							rootPath="/notes"
							initialPageSize={10}
							defaultValues={{ title: "New note" }}
						/>
					</PageContainer>
				</DashboardLayout>
			</AppProvider>
	
	);
}
