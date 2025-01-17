import { useEditorState } from '@udecode/plate-core';
import {
  isCollapsed,
  isElementEmpty,
  queryNode,
  QueryNodeOptions,
} from '@udecode/slate';
import { findNodePath } from '@udecode/slate-react';
import { useFocused, useSelected } from 'slate-react';

import { PlateElementProps } from '..';

export interface PlaceholderProps extends PlateElementProps {
  placeholder: string;
  hideOnBlur?: boolean;
  query?: QueryNodeOptions;
}

export const usePlaceholderState = ({
  hideOnBlur = true,
  query,
  element,
}: PlaceholderProps) => {
  const focused = useFocused();
  const selected = useSelected();
  const editor = useEditorState();

  const isEmptyBlock = isElementEmpty(editor, element);

  const enabled =
    isEmptyBlock &&
    (!query || queryNode([element, findNodePath(editor, element)!], query)) &&
    (!hideOnBlur ||
      (isCollapsed(editor.selection) && hideOnBlur && focused && selected));

  return {
    enabled,
  };
};
