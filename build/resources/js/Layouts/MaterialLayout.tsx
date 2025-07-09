import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
  AccountCircle,
  Add as AddIcon,
  AdminPanelSettings,
  Assessment,
  Assignment as AssignmentIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Logout,
  Menu as MenuIcon,
  NotificationsNone,
  People as PeopleIcon,
  Settings,
  Timeline,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const drawerWidth = 280;

interface Props {
  children: React.ReactNode;
  title?: string;
}

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  href?: string;
  roles?: string[];
  children?: NavigationItem[];
  badge?: number;
}

export default function MaterialLayout({ children, title }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigationItems: NavigationItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/dashboard',
    },
    {
      text: 'Manajemen Pinjaman',
      icon: <AssignmentIcon />,
      children: [
        {
          text: 'Daftar Pinjaman',
          icon: <AssignmentIcon />,
          href: '/pinjaman',
        },
        {
          text: 'Buat Pengajuan',
          icon: <AddIcon />,
          href: '/pinjaman/create',
          roles: ['staf_input'],
        },
        {
          text: 'Workflow Progress',
          icon: <Timeline />,
          href: '/pinjaman/workflow',
          roles: ['admin_kredit', 'analis', 'pemutus'],
        },
      ],
    },
    {
      text: 'Master Data',
      icon: <PeopleIcon />,
      children: [
        {
          text: 'Daftar Nasabah',
          icon: <PeopleIcon />,
          href: '/nasabah',
          roles: ['admin_kredit', 'analis', 'pemutus'],
        },
        {
          text: 'Manajemen User',
          icon: <AdminPanelSettings />,
          href: '/users',
          roles: ['admin'], // Super admin only
        },
      ],
    },
    {
      text: 'Laporan',
      icon: <Assessment />,
      children: [
        {
          text: 'Laporan Pinjaman',
          icon: <Assessment />,
          href: '/reports/pinjaman',
          roles: ['admin_kredit', 'pemutus'],
        },
        {
          text: 'Statistik Workflow',
          icon: <Timeline />,
          href: '/reports/workflow',
          roles: ['pemutus'],
        },
      ],
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = (itemText: string) => {
    setExpandedItems(prev =>
      prev.includes(itemText)
        ? prev.filter(item => item !== itemText)
        : [...prev, itemText]
    );
  };

  const hasPermission = (roles?: string[]) => {
    if (!roles) return true;
    return roles.includes(user.role);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: '#e91e63',
      staf_input: '#2196f3',
      admin_kredit: '#ff9800',
      analis: '#9c27b0',
      pemutus: '#4caf50',
    };
    return colors[role as keyof typeof colors] || '#757575';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
        }}
      >
        <AssignmentIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" fontWeight="bold">
          Berkas App
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 1,
            bgcolor: getRoleColor(user.role),
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle2" fontWeight="600">
          {user.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            px: 1,
            py: 0.5,
            bgcolor: getRoleColor(user.role),
            color: 'white',
            borderRadius: 1,
            textTransform: 'capitalize',
          }}
        >
          {user.role.replace('_', ' ')}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {navigationItems.map(item => {
          if (!hasPermission(item.roles)) return null;

          const isExpanded = expandedItems.includes(item.text);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  component={hasChildren ? 'div' : Link}
                  href={hasChildren ? undefined : item.href}
                  onClick={
                    hasChildren ? () => handleExpandClick(item.text) : undefined
                  }
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  />
                  {item.badge && (
                    <Badge
                      badgeContent={item.badge}
                      color="error"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {hasChildren &&
                    (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              {hasChildren && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Collapse in={isExpanded} timeout="auto">
                        <List disablePadding>
                          {item.children?.map(child => {
                            if (!hasPermission(child.roles)) return null;

                            return (
                              <ListItem key={child.text} disablePadding>
                                <ListItemButton
                                  component={Link}
                                  href={child.href}
                                  sx={{
                                    pl: 4,
                                    borderRadius: 2,
                                    mx: 1,
                                    '&:hover': {
                                      bgcolor: 'secondary.light',
                                      color: 'white',
                                    },
                                  }}
                                >
                                  <ListItemIcon
                                    sx={{
                                      color: 'inherit',
                                      minWidth: 40,
                                    }}
                                  >
                                    {child.icon}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={child.text}
                                    primaryTypographyProps={{
                                      fontSize: '0.8rem',
                                    }}
                                  />
                                  {child.badge && (
                                    <Badge
                                      badgeContent={child.badge}
                                      color="error"
                                    />
                                  )}
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title || 'Dashboard'}
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsNone />
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Settings />
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: getRoleColor(user.role),
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} href="/profile">
          <AccountCircle sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem component={Link} href="/logout" method="post">
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
}
