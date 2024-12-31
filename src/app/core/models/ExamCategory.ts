// exam-category.interface.ts
export interface ExamCategory {
    categoryId: string;
    categoryName: string;
    categoryType: string;
    categoryCode?: string;
    description?: string;
    content?: string;
    sortOrder?: number;
    isActive: string;
    createTime?: Date;
    createUser?: string;
    updateTime?: Date;
    updateUser?: string;
}
export interface SearchParams {
    categoryName?: string;
    categoryCode?: string;
    categoryType?: string;
    isActive?: string;
  }