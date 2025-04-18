import React, { useEffect, useState } from "react";
import axios from "axios";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import "./AdminPage.css";
import config from "../config";

const AdminPage = () => {
  const [technologies, setTechnologies] = useState([]);
  const [domains, setDomains] = useState([]);
  const [skills, setSkills] = useState([]);

  const [newTechnology, setNewTechnology] = useState("");
  const [newDomain, setNewDomain] = useState({ name: "", technology_id: "" });
  const [newSkill, setNewSkill] = useState({ name: "", domain_id: "" });

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const techRes = await axios.get(`${config.API_BASE_URL}/admin/technologies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const domainRes = await axios.get(`${config.API_BASE_URL}/admin/domains/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const skillRes = await axios.get(`${config.API_BASE_URL}/admin/skills/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTechnologies(techRes.data);
      setDomains(domainRes.data);
      setSkills(skillRes.data);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    }
  };

  const addTechnology = async () => {
    try {
      await axios.post(
        `${config.API_BASE_URL}/admin/technologies`,
        { name: newTechnology },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTechnology("");
      fetchAll();
    } catch (err) {
      console.error("❌ Error adding technology:", err);
    }
  };

  const addDomain = async () => {
    try {
      await axios.post(
        `${config.API_BASE_URL}/admin/domains`,
        newDomain,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewDomain({ name: "", technology_id: "" });
      fetchAll();
    } catch (err) {
      console.error("❌ Error adding domain:", err);
    }
  };

  const addSkill = async () => {
    try {
      await axios.post(
        `${config.API_BASE_URL}/admin/skills`,
        newSkill,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSkill({ name: "", domain_id: "" });
      fetchAll();
    } catch (err) {
      console.error("❌ Error adding skill:", err);
    }
  };

  // 🔁 Combine tech + domain + skill into a nested tree
  const buildTree = () => {
    return technologies.map((tech) => ({
      id: `tech-${tech.id}`,
      name: tech.name,
      children: domains
        .filter((d) => d.technology_id === tech.id)
        .map((domain) => ({
          id: `domain-${domain.id}`,
          name: domain.name,
          children: skills
            .filter((s) => s.domain_id === domain.id)
            .map((skill) => ({
              id: `skill-${skill.id}`,
              name: skill.name,
            })),
        })),
    }));
  };

  const treeItems = buildTree();

  return (
    <div className="admin-container">
      {/* Left Side: Admin Panel */}
      <div className="admin-panel">
        <h2>Admin Panel</h2>

        {/* Technologies Section */}
        <div className="admin-section">
          <h3>Technologies</h3>
          <input
            type="text"
            value={newTechnology}
            onChange={(e) => setNewTechnology(e.target.value)}
            placeholder="Add Technology"
          />
          <button onClick={addTechnology}>Add</button>
        </div>

        {/* Domains Section */}
        <div className="admin-section">
          <h3>Domains</h3>
          <select
            onChange={(e) => setNewDomain({ ...newDomain, technology_id: e.target.value })}
            value={newDomain.technology_id}
          >
            <option value="">Select Technology</option>
            {technologies.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newDomain.name}
            onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
            placeholder="Add Domain"
          />
          <button onClick={addDomain}>Add</button>
        </div>

        {/* Skills Section */}
        <div className="admin-section">
          <h3>Skills</h3>
          <select
            onChange={(e) => setNewSkill({ ...newSkill, domain_id: e.target.value })}
            value={newSkill.domain_id}
          >
            <option value="">Select Domain</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Add Skill"
          />
          <button onClick={addSkill}>Add</button>
        </div>
      </div>

      {/* Right Side: Tree View */}
      <div className="hierarchy-panel">
        <h2>Technology Hierarchy</h2>
        <TreeView
            items={treeItems}
            getItemId={(item) => item.id}
            getItemLabel={(item) => item.name}
            getItemChildren={(item) => item.children || []}
            defaultExpanded={
                treeItems.flatMap((tech) => [
                tech.id,
                ...(tech.children || []).map((d) => d.id),
                ...(tech.children || []).flatMap((d) =>
                    (d.children || []).map((s) => s.id)
                ),
                ])
            }
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            />
      </div>
    </div>
  );
};

export default AdminPage;
