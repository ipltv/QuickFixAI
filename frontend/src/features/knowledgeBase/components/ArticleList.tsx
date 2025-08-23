import type { FunctionComponent } from "react";

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import type { KnowledgeArticle } from "../../../types/index";

interface ArticleListProps {
  articles: KnowledgeArticle[];
  canManage: boolean;
  onView: (article: KnowledgeArticle) => void;
  onEdit: (article: KnowledgeArticle) => void;
  onDelete: (articleId: string) => void;
}

export const ArticleList: FunctionComponent<ArticleListProps> = ({
  articles,
  canManage,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tags</TableCell>
            {/* Conditionally render the "Actions" header */}
            {canManage && (
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article) => (
            <TableRow
              key={article.id}
              hover
              onClick={() => onView(article)} // Trigger onView on row click
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.tags?.join(", ")}</TableCell>
              {/* Conditionally render the action buttons */}
              {canManage && (
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(article)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => onDelete(article.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
