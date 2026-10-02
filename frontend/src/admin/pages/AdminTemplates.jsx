import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  LayoutTemplate,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import BusinessCardCustomizer, {
  TemplatePreview,
} from "../../pages/BusinessCardCustomizer";
import MugDesigner from "../components/MugDesigner";
import { fetchProducts } from "../../services/productApi";
import {
  createProductTemplate,
  deleteProductTemplate,
  fetchAllTemplatesGrouped,
  updateProductTemplate,
} from "../../services/templateApi";

import "./AdminTemplates.css";

const CARD_TYPES = ["business-card"];
const MUG_TYPES = ["mug"];

/* ============================================================
   GENERIC PREVIEW — renders {front:[els], back:[els]} designs
   from the non-card customizer (print-area % coordinates)
============================================================ */
/* near-white element? garments/pens print on dark surfaces,
   paper/mugs on light — preview surface auto-adapts */
const isLightHex = (c) => {
  const m = /^#([0-9a-f]{6})$/i.exec(String(c || "").trim());
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.72;
};

const GenericTemplatePreview = ({ design }) => {
  const els = Array.isArray(design?.front)
    ? design.front.filter((e) => !e.hidden).slice(0, 12)
    : [];

  const colors = els
    .map((e) => e.color)
    .filter((c) => typeof c === "string" && c.startsWith("#"));
  const darkSurface =
    colors.length > 0 &&
    colors.filter(isLightHex).length / colors.length >= 0.6;

  return (
    <div
      className={`at-generic-preview${
        darkSurface ? " dark" : ""
      }`}
    >
      {els.map((el, i) => {
        const s = {
          position: "absolute",
          left: `${el.x}%`,
          top: `${el.y}%`,
          transform: `translate(-50%,-50%) rotate(${
            el.rotation || 0
          }deg)`,
          opacity: el.opacity ?? 1,
        };

        if (el.type === "text")
          return (
            <div
              key={i}
              style={{
                ...s,
                fontFamily: el.fontFamily,
                fontSize: `${Math.max(
                  4,
                  (el.fontSize || 12) * 0.42
                )}px`,
                fontWeight: el.bold ? 700 : 400,
                fontStyle: el.italic ? "italic" : "normal",
                textDecoration: el.underline
                  ? "underline"
                  : "none",
                color: el.color,
                textAlign: el.align || "center",
                letterSpacing: `${
                  (el.letterSpacing || 0) * 0.3
                }px`,
                whiteSpace: "pre-line",
                lineHeight: 1.25,
              }}
            >
              {el.text}
            </div>
          );

        if (el.type === "shape")
          return (
            <div
              key={i}
              style={{
                ...s,
                width: `${el.width}%`,
                height:
                  el.shape === "line"
                    ? "1.5px"
                    : `${el.height}%`,
                background: el.color,
                borderRadius:
                  el.shape === "circle"
                    ? "50%"
                    : "3px",
              }}
            />
          );

        if (el.type === "qr")
          return (
            <div
              key={i}
              className="at-generic-qr"
              style={{ ...s, width: `${el.width}%` }}
            />
          );

        if (el.type === "image" && el.src)
          return (
            <img
              key={i}
              src={el.src}
              alt=""
              style={{ ...s, width: `${el.width}%` }}
            />
          );

        return null;
      })}
    </div>
  );
};

/* ============================================================
   ADMIN → TEMPLATES
   product-wise grouped template catalog.
   har template ek specific product ka hota hai.
============================================================ */
export default function AdminTemplates() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");

  /* add/edit modal */
  const [modal, setModal] = useState(null); // {mode:'add'|'edit', template?, productId}
  const [designerOpen, setDesignerOpen] =
    useState(false);

  /* delete confirm */
  const [confirmDelete, setConfirmDelete] =
    useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [prods, grouped] = await Promise.all([
        fetchProducts(),
        fetchAllTemplatesGrouped(),
      ]);
      setProducts(Array.isArray(prods) ? prods : []);
      setGroups(grouped);
    } catch (e) {
      setError(e.message || "Unable to load templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------- grouped view: customizable products ∪
     products that already have templates ---------- */
  const view = useMemo(() => {
    const tplByProduct = new Map(
      groups.map((g) => [Number(g.productId), g])
    );

    const list = products
      .filter((p) => {
        const hasTemplates = tplByProduct.has(
          Number(p.id)
        );
        const customizable = Boolean(
          p.customizable ?? p.customisable
        );
        return customizable || hasTemplates;
      })
      .map((p) => {
        const g = tplByProduct.get(Number(p.id));
        return {
          productId: Number(p.id),
          productName:
            g?.productName || p.name || "Product",
          productType:
            g?.productType ||
            p.customizationType ||
            p.type ||
            "",
          templates: g?.templates || [],
        };
      });

    const q = search.trim().toLowerCase();

    return list
      .filter(
        (g) =>
          productFilter === "all" ||
          String(g.productId) === productFilter
      )
      .map((g) => ({
        ...g,
        templates: q
          ? g.templates.filter(
              (t) =>
                t.name.toLowerCase().includes(q) ||
                g.productName.toLowerCase().includes(q)
            )
          : g.templates,
      }))
      .filter(
        (g) => !q || g.templates.length > 0 ||
          g.productName.toLowerCase().includes(q)
      );
  }, [products, groups, search, productFilter]);

  /* ---------- CRUD ---------- */

  const openAdd = (productId = null) =>
    setModal({
      mode: "add",
      productId: productId ?? "",
      name: "",
      status: "Active",
      design: null,
      sortOrder: 9999,
    });

  const openEdit = (group, t) =>
    setModal({
      mode: "edit",
      template: t,
      productId: group.productId,
      name: t.name,
      status: t.status || "Active",
      design: t.design,
      sortOrder: t.sortOrder || 0,
    });

  const saveModal = async () => {
    if (!modal) return;
    const pid = Number(modal.productId);
    if (!pid) {
      alert("Please select a product.");
      return;
    }
    if (!modal.name.trim()) {
      alert("Template name is required.");
      return;
    }

    try {
      if (modal.mode === "add") {
        await createProductTemplate(pid, {
          name: modal.name.trim(),
          status: modal.status,
          design: modal.design,
          sortOrder: modal.sortOrder,
        });
      } else {
        await updateProductTemplate(
          modal.template.productId,
          modal.template.id,
          {
            name: modal.name.trim(),
            status: modal.status,
            design: modal.design,
            sortOrder: modal.sortOrder,
            productId: pid,
          }
        );
      }
      setModal(null);
      await load();
    } catch (e) {
      alert(e.message || "Unable to save template.");
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProductTemplate(
        confirmDelete.productId,
        confirmDelete.id
      );
      setConfirmDelete(null);
      await load();
    } catch (e) {
      alert(e.message || "Unable to delete template.");
    }
  };

  const toggleStatus = async (t) => {
    try {
      await updateProductTemplate(t.productId, t.id, {
        status:
          t.status === "Inactive" ? "Active" : "Inactive",
      });
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  const duplicate = async (group, t) => {
    try {
      await createProductTemplate(group.productId, {
        name: `${t.name} (Copy)`.slice(0, 100),
        status: "Inactive",
        design: t.design,
        sortOrder: (t.sortOrder || 0) + 1,
      });
      await load();
    } catch (e) {
      alert(e.message || "Unable to duplicate template.");
    }
  };

  const move = async (group, index, dir) => {
    const list = group.templates;
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    try {
      await Promise.all([
        updateProductTemplate(
          group.productId,
          list[index].id,
          { sortOrder: target }
        ),
        updateProductTemplate(
          group.productId,
          list[target].id,
          { sortOrder: index }
        ),
      ]);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  const modalProduct = products.find(
    (p) => Number(p.id) === Number(modal?.productId)
  );
  const modalType = String(
    modalProduct?.customizationType ||
      modalProduct?.type ||
      ""
  ).toLowerCase();
  const designerSupported =
    CARD_TYPES.includes(modalType) ||
    MUG_TYPES.includes(modalType);

  /* ---------- render ---------- */

  return (
    <div className="admin-templates-page">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <h2>
            <LayoutTemplate size={22} /> Templates
          </h2>
          <p>
            Manage product-specific customization
            templates.
          </p>
        </div>

        <button
          type="button"
          className="at-add-btn"
          onClick={() => openAdd()}
        >
          <Plus size={16} /> Add Template
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="at-toolbar">
        <div className="at-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search templates or products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="at-product-filter"
          value={productFilter}
          onChange={(e) =>
            setProductFilter(e.target.value)
          }
        >
          <option value="all">All Products</option>
          {view.map((g) => (
            <option
              key={g.productId}
              value={String(g.productId)}
            >
              {g.productName}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="at-error">{error}</p>}
      {loading && (
        <p className="at-note">Loading templates...</p>
      )}

      {!loading && view.length === 0 && (
        <p className="at-note">
          No customizable products or templates found.
        </p>
      )}

      {/* PRODUCT GROUPS */}
      {view.map((group) => (
        <section
          className="at-group"
          key={group.productId}
        >
          <div className="at-group-head">
            <div>
              <h3>{group.productName}</h3>
              <span className="at-count">
                {group.templates.length} template
                {group.templates.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>
            <button
              type="button"
              className="at-group-add"
              onClick={() => openAdd(group.productId)}
            >
              <Plus size={14} /> Add Template
            </button>
          </div>

          {group.templates.length === 0 ? (
            <p className="at-empty">
              No templates for this product yet.
            </p>
          ) : (
            <div className="at-cards">
              {group.templates.map((t, i) => (
                <article
                  className={`at-card ${
                    t.status === "Inactive"
                      ? "inactive"
                      : ""
                  }`}
                  key={t.id}
                >
                  <div className="at-preview">
                    {t.design?.frontDesign ? (
                      <TemplatePreview
                        tpl={{
                          frontDesign: t.design.frontDesign,
                        }}
                      />
                    ) : Array.isArray(t.design?.front) ? (
                      <GenericTemplatePreview
                        design={t.design}
                      />
                    ) : (
                      <span className="at-no-design">
                        No design
                      </span>
                    )}
                  </div>

                  <div className="at-card-body">
                    <strong className="at-name">
                      {t.name}
                    </strong>
                    <button
                      type="button"
                      className={`at-status ${
                        t.status === "Inactive"
                          ? "off"
                          : ""
                      }`}
                      title="Toggle Active / Inactive"
                      onClick={() => toggleStatus(t)}
                    >
                      {t.status || "Active"}
                    </button>
                  </div>

                  <div className="at-card-actions">
                    <button
                      type="button"
                      className="at-act"
                      title="Move up"
                      disabled={i === 0}
                      onClick={() =>
                        move(group, i, -1)
                      }
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      className="at-act"
                      title="Move down"
                      disabled={
                        i === group.templates.length - 1
                      }
                      onClick={() => move(group, i, 1)}
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      className="at-act"
                      title="Edit template"
                      onClick={() => openEdit(group, t)}
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      className="at-act"
                      title="Duplicate template"
                      onClick={() =>
                        duplicate(group, t)
                      }
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      type="button"
                      className="at-act danger"
                      title="Delete template"
                      onClick={() =>
                        setConfirmDelete({
                          ...t,
                          productId: group.productId,
                        })
                      }
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div
          className="at-overlay"
          onClick={() => setModal(null)}
        >
          <div
            className="at-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {modal.mode === "add"
                ? "Add Template"
                : "Edit Template"}
            </h3>

            <label className="at-field">
              <span>Product</span>
              <select
                value={modal.productId}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    productId: e.target.value,
                  })
                }
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            {modalProduct && (
              <p className="at-belongs">
                Template belongs to:{" "}
                <strong>{modalProduct.name}</strong>
              </p>
            )}

            <label className="at-field">
              <span>Template Name</span>
              <input
                type="text"
                value={modal.name}
                maxLength={100}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    name: e.target.value,
                  })
                }
              />
            </label>

            <label className="at-field">
              <span>Status</span>
              <select
                value={modal.status}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    status: e.target.value,
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </label>

            <label className="at-field">
              <span>Sort Order</span>
              <input
                type="number"
                min="0"
                value={modal.sortOrder}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    sortOrder: Number(e.target.value) || 0,
                  })
                }
              />
            </label>

            <button
              type="button"
              className="at-designer-btn"
              disabled={
                !modalProduct || !designerSupported
              }
              onClick={() => setDesignerOpen(true)}
            >
              <Pencil size={14} />
              {modal.mode === "add"
                ? "Design Template"
                : "Open Designer"}
            </button>

            {modalProduct && !designerSupported && (
              <p className="at-note">
                Visual designer is available for Business
                Card and Mug products. Other types store
                name / status only.
              </p>
            )}

            {modal.design && (
              <div className="at-modal-preview">
                {modal.design.frontDesign ? (
                  <TemplatePreview
                    tpl={{
                      frontDesign:
                        modal.design.frontDesign,
                    }}
                  />
                ) : Array.isArray(modal.design.front) ? (
                  <GenericTemplatePreview
                    design={modal.design}
                  />
                ) : null}
              </div>
            )}

            <div className="at-modal-actions">
              <button
                type="button"
                className="at-btn ghost"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="at-btn primary"
                onClick={saveModal}
              >
                {modal.mode === "add"
                  ? "Save Template"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div
          className="at-overlay"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="at-modal at-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              Delete "{confirmDelete.name}"?
            </h3>
            <p className="at-note">
              This template will no longer be available to
              customers. Existing order designs are not
              affected.
            </p>
            <div className="at-modal-actions">
              <button
                type="button"
                className="at-btn ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="at-btn danger"
                onClick={doDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMBEDDED DESIGNER */}
      {designerOpen && modal && modalProduct && (
        <div className="at-overlay">
          <div className="at-designer">
            <div className="at-designer-head">
              <strong>
                Template Designer — {modal.name} (
                {modalProduct.name})
              </strong>
              <button
                type="button"
                className="at-act"
                onClick={() => setDesignerOpen(false)}
              >
                <X size={15} />
              </button>
            </div>
            {MUG_TYPES.includes(modalType) ? (
              <MugDesigner
                productName={modalProduct.name}
                initialDesign={modal.design}
                onSaveTemplate={(design) => {
                  setModal({ ...modal, design });
                  setDesignerOpen(false);
                }}
                onCancel={() => setDesignerOpen(false)}
              />
            ) : (
              <BusinessCardCustomizer
                embedded
                propProduct={{
                  id: modalProduct.id,
                  name: modalProduct.name,
                }}
                initialDesign={modal.design}
                onSaveTemplate={(design) => {
                  setModal({ ...modal, design });
                  setDesignerOpen(false);
                }}
                onCancel={() => setDesignerOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
