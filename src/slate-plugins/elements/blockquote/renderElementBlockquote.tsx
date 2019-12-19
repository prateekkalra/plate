import React from 'react';
import { ElementType } from 'slate-plugins/common';
import { RenderElementProps } from 'slate-react';

export const renderElementBlockquote = () => ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  if (element.type === ElementType.BLOCK_QUOTE) {
    return <blockquote {...attributes}>{children}</blockquote>;
  }
};