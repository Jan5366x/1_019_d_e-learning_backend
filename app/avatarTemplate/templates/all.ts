import BlankTemplate from "./blankTemplate.json";

export default class AvatarTemplates {
    public static templates: { [key: string]: Object } = { "BlankTemplate": BlankTemplate }

    public static getTemplate(id: string): Object { return this.templates[id]; }
}