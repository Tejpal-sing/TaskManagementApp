import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Crud, DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import { createSelectorCreator } from '../../src/reselect-shim';
import axios from 'axios';
import logo from '../assets/currentlogo.png';
import { Box } from '@mui/material';
const NAVIGATION: Navigation = [
  {
    segment: 'notes',
    title: 'Notes',
    icon: <StickyNote2Icon />,
    pattern: 'notes{/:noteId}*',
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
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

const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/'; // or navigate to login if available
  };
  

export interface Note extends DataModel {
  id: number;
  title: string;
  body: string;
}

let notesStore: Note[] = [
  { id: 1, title: 'Grocery List Item', body: 'Buy more coffee.' },
  { id: 2, title: 'Personal Goal', body: 'Finish reading the book.' },
];

export const notesDataSource: DataSource<Note> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'body', headerName: 'Body', flex: 1 },
  ],
 

  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      const response = await axios.get('http://localhost:8000/api/todos/retrieveUserData', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      console.log(response);
      const allNotes = response.data;
      console.log(allNotes);
  
      let processedNotes = [...allNotes];
  
      // Apply filters (client-side)
      if (filterModel?.items?.length) {
        filterModel.items.forEach(({ field, value, operator }) => {
          if (!field || value == null) return;
  
          processedNotes = processedNotes.filter((note) => {
            const noteValue = note[field];
  
            switch (operator) {
              case 'contains':
                return String(noteValue).toLowerCase().includes(String(value).toLowerCase());
              case 'equals':
                return noteValue === value;
              case 'startsWith':
                return String(noteValue).toLowerCase().startsWith(String(value).toLowerCase());
              case 'endsWith':
                return String(noteValue).toLowerCase().endsWith(String(value).toLowerCase());
              case '>':
                return (noteValue as number) > value;
              case '<':
                return (noteValue as number) < value;
              default:
                return true;
            }
          });
        });
      }
  
      // Apply sorting
      if (sortModel?.length) {
        processedNotes.sort((a, b) => {
          for (const { field, sort } of sortModel) {
            if ((a[field] as number) < (b[field] as number)) return sort === 'asc' ? -1 : 1;
            if ((a[field] as number) > (b[field] as number)) return sort === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
  
      // Apply pagination
      const start = paginationModel.page * paginationModel.pageSize;
      const end = start + paginationModel.pageSize;
      const paginatedNotes = processedNotes.slice(start, end);
  
      return {
        items: paginatedNotes,
        itemCount: processedNotes.length,
      };
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }
,  

  getOne: async (noteId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      const res = await axios.get(`http://localhost:8000/api/todos/retrieve/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      return res.data[0]; // assuming backend returns the note object
      
    } catch (error) {
      console.error('Error fetching note:', error);
      throw error;
    }
  },
  
//   createOne: async (data) => {
//     // Simulate loading delay
//     await new Promise((resolve) => {
//       setTimeout(resolve, 750);
//     });

//     const newNote = {
//       id: notesStore.reduce((max, note) => Math.max(max, note.id), 0) + 1,
//       ...data,
//     } as Note;

//     notesStore = [...notesStore, newNote];

//     return newNote;
//   },

    
    createOne: async (data) => {
        try {
        const accessToken = localStorage.getItem('accessToken');
        
        const res = await axios.post(`http://localhost:8000/api/todos/create`, data, {
            headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
            }
        });
       
        return res.data;
        } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
        }
    },

  

    updateOne: async (noteId, data) => {
        try {
          const accessToken = localStorage.getItem('accessToken');
            console.log("noteID is:",noteId);
          const response = await axios.put(
            `http://localhost:8000/api/todos/update/${noteId}`,
            data,
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );
      
          return response.data;
        } catch (error) {
          console.error('Error updating todo:', error);
          throw error;
        }
      },      
  

    deleteOne: async (noteId) => {
        try {
          const accessToken = localStorage.getItem('accessToken');
      
          const res = await axios.delete(`http://localhost:8000/api/todos/delete/${noteId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
            },
          });
      
          return res.data; // Optionally return a message from backend
        } catch (error) {
          console.error('Error deleting todo:', error);
          throw error;
        }
    },

  validate: (formValues) => {
    let issues: { message: string; path: [keyof Note] }[] = [];

    if (!formValues.title) {
      issues = [...issues, { message: 'Title is required', path: ['title'] }];
    }

    if (formValues.title && formValues.title.length < 3) {
      issues = [
        ...issues,
        {
          message: 'Title must be at least 3 characters long',
          path: ['title'],
        },
      ];
    }

    if (!formValues.body) {
      issues = [...issues, { message: 'body is required', path: ['body'] }];
    }

    return { issues };
  },
};

const notesCache = new DataSourceCache();

function matchPath(pattern: string, pathname: string): string | null {
  const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);
  const match = pathname.match(regex);
  return match ? match[1] : null;
}

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}


export default function CrudBasic(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter('/notes');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  const title = React.useMemo(() => {
    if (router.pathname === '/notes/new') {
      return 'New Note';
    }
    const editNoteId = matchPath('/notes/:noteId/edit', router.pathname);
    if (editNoteId) {
      return `Note ${editNoteId} - Edit`;
    }
    const showNoteId = matchPath('/notes/:noteId', router.pathname);
    if (showNoteId) {
      return `Note ${showNoteId}`;
    }

    return undefined;
  }, [router.pathname]);

  return (
    // Remove this provider when copying and pasting into your project.
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
        branding={{
          title: 'TodoApp',
          logo: (
            <Box component="img" src={logo} alt="Logo" sx={{ width: 40, height: 40 }} />
          ),
        }}
      >
        <DashboardLayout defaultSidebarCollapsed>
          <PageContainer title={title}> 
            {/* preview-start */}
            <Crud<Note>
              dataSource={notesDataSource}
              dataSourceCache={notesCache}
              rootPath="/notes"
              initialPageSize={10}
              defaultValues={{ title: 'New note' }}
            />
            {/* preview-end */}
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
