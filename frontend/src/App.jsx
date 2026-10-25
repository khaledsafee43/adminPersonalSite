import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ContentManager from "./components/ContentManager";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Collections from "./pages/Collections";
import EditorPage from "./pages/EditorPage";
const pages = [
  [
    "/home",
    "home",
    "Home page management",
    "Manage your homepage headline, introduction, featured links, and hero image.",
    "homepage",
    ["title", "headline", "subtitle", "description", "image", "url", "status"],
  ],
  [
    "/about",
    "about",
    "About management",
    "Manage your biography, background, and the story shown on your portfolio.",
    "about section",
    ["title", "slug", "description", "image", "status"],
  ],
  [
    "/projects",
    "projects",
    "Projects management",
    "Create, update, search, and publish portfolio projects.",
    "project",
    ["title", "slug", "description", "tags", "url", "image", "status"],
  ],
  [
    "/blog",
    "posts",
    "Blog posts management",
    "Maintain articles, tutorials, and updates for your portfolio blog.",
    "blog post",
    ["title", "slug", "description", "tags", "image", "url", "status"],
  ],
  [
    "/skills",
    "skills",
    "Skills management",
    "Organize technical skills and proficiency details.",
    "skill",
    ["title", "slug", "description", "tags", "status"],
  ],
  [
    "/services",
    "services",
    "Services management",
    "Describe the services clients can request from you.",
    "service",
    ["title", "slug", "description", "tags", "url", "image", "status"],
  ],
  [
    "/resume",
    "resume",
    "Resume management",
    "Manage resume information and the URL to your latest CV.",
    "resume entry",
    ["title", "slug", "description", "downloadUrl", "url", "status"],
  ],
  [
    "/contact-page",
    "contact",
    "Contact page management",
    "Manage contact details and the information visitors see.",
    "contact setting",
    ["title", "description", "email", "phone", "location", "website", "status"],
  ],
  [
    "/notifications",
    "notifications",
    "Notifications",
    "Manage notification items displayed in your admin workspace.",
    "notification",
    ["title", "description", "status"],
  ],
  [
    "/seo",
    "seo",
    "SEO settings",
    "Set page titles, meta descriptions, keywords, and share preview defaults.",
    "SEO setting",
    [
      "title",
      "slug",
      "siteTitle",
      "metaDescription",
      "keywords",
      "image",
      "status",
    ],
  ],
  [
    "/appearance",
    "appearance",
    "Appearance settings",
    "Store visual preferences such as accent color and portfolio display options.",
    "appearance setting",
    ["title", "primaryColor", "description", "status"],
  ],
  [
    "/languages",
    "languages",
    "Language settings",
    "Configure enabled languages and default language preferences.",
    "language setting",
    ["title", "defaultLanguage", "description", "status"],
  ],
  [
    "/settings",
    "general",
    "General settings",
    "Manage general site metadata and default portfolio settings.",
    "setting",
    ["title", "siteTitle", "description", "email", "website", "status"],
  ],
];
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          {pages.map(([path, type, title, description, singular, fields]) => (
            <Route
              key={path}
              path={path.slice(1)}
              element={
                <ContentManager
                  type={type}
                  title={title}
                  description={description}
                  singular={singular}
                  fields={fields}
                />
              }
            />
          ))}
          <Route
            path="/messages"
            element={
              <Collections
                kind="messages"
                title="Messages"
                description="Read incoming messages and update their status."
              />
            }
          />
          <Route
            path="/clients"
            element={
              <Collections
                kind="clients"
                title="Clients"
                description="Manage client records and relationship status."
              />
            }
          />
          <Route
            path="/requests"
            element={
              <Collections
                kind="requests"
                title="Project requests"
                description="Review new project enquiries and track their progress."
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/project-editor"
            element={
              <EditorPage type="projects" title="Projects" backTo="/projects" />
            }
          />
          <Route
            path="/project-editor/:id"
            element={
              <EditorPage type="projects" title="Projects" backTo="/projects" />
            }
          />
          <Route
            path="/blog-editor"
            element={
              <EditorPage type="posts" title="Blog posts" backTo="/blog" />
            }
          />
          <Route
            path="/blog-editor/:id"
            element={
              <EditorPage type="posts" title="Blog posts" backTo="/blog" />
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
