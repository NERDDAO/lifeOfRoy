import ConfigItem from "~~/components/chatComponents/bot/bot-settings/config-item";
import { useSidebarContext } from "~~/app/home";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~~/components/chatComponents/ui/alert-dialog";
import { Button, buttonVariants } from "~~/components/chatComponents/ui/button";
import { Card, CardContent } from "~~/components/chatComponents/ui/card";
import { ScrollArea } from "~~/components/chatComponents/ui/scroll-area";
import { Separator } from "~~/components/chatComponents/ui/separator";
import Typography from "~~/components/chatComponents/ui/typography";
import { useToast } from "~~/components/chatComponents/ui/use-toast";
import { cn } from "~~/lib/utils";
import { ArchiveRestore, HardDriveDownload, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileName, Path } from "~~/constant";
import Locale from "~~/locales";
import { useBotStore } from "~~/services/store/bot";
import { downloadAs, readFromFile } from "~~/utils/download";
import { useMobileScreen } from "~~/utils/mobile";
import { ErrorBoundary } from "./layout/error";

function SettingHeader() {
    const navigate = useNavigate();
    const { setShowSidebar } = useSidebarContext();
    const isMobileScreen = useMobileScreen();
    return (
        <div className="relative flex justify-between items-center px-5 py-3.5">
            <div>
                <Typography.H4>{Locale.Settings.Title}</Typography.H4>
                <div className="text-sm text-muted-foreground">
                    {Locale.Settings.SubTitle}
                </div>
            </div>
            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    navigate(Path.Home);
                    if (isMobileScreen) setShowSidebar(true);
                }}
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}

function DangerItems() {
    const botStore = useBotStore();
    return (
        <Card>
            <CardContent className="divide-y p-5">
                <ConfigItem
                    title={Locale.Settings.Danger.Clear.Title}
                    subTitle={Locale.Settings.Danger.Clear.SubTitle}
                >
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                {Locale.Settings.Danger.Clear.Action}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {Locale.Settings.Danger.Clear.Confirm}
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className={cn(buttonVariants({ variant: "destructive" }))}
                                    onClick={() => {
                                        botStore.clearAllData();
                                    }}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </ConfigItem>
            </CardContent>
        </Card>
    );
}

function BackupItems() {
    const botStore = useBotStore();
    const { toast } = useToast();

    const backupBots = () => {
        downloadAs(JSON.stringify(botStore.backup()), FileName.Bots);
    };

    const restoreBots = async () => {
        try {
            const content = await readFromFile();
            const importBots = JSON.parse(content);
            botStore.restore(importBots);
            toast({
                title: Locale.Settings.Backup.Upload.Success,
                variant: "success",
            });
        } catch (err) {
            console.error("[Restore] ", err);
            toast({
                title: Locale.Settings.Backup.Upload.Failed((err as Error).message),
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="mb-5">
            <CardContent className="divide-y p-5">
                <ConfigItem
                    title={Locale.Settings.Backup.Download.Title}
                    subTitle={Locale.Settings.Backup.Download.SutTitle}
                >
                    <Button variant="outline" size="icon" onClick={backupBots}>
                        <HardDriveDownload className="w-5 h-5" />
                    </Button>
                </ConfigItem>
                <ConfigItem
                    title={Locale.Settings.Backup.Upload.Title}
                    subTitle={Locale.Settings.Backup.Upload.SutTitle}
                >
                    <Button variant="outline" size="icon" onClick={restoreBots}>
                        <ArchiveRestore className="w-5 h-5" />
                    </Button>
                </ConfigItem>
            </CardContent>
        </Card>
    );
}

export function Settings() {
    const navigate = useNavigate();
    const { setShowSidebar } = useSidebarContext();
    const isMobileScreen = useMobileScreen();
    useEffect(() => {
        const keydownEvent = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                navigate(Path.Home);
                if (isMobileScreen) setShowSidebar(true);
            }
        };
        document.addEventListener("keydown", keydownEvent);
        return () => {
            document.removeEventListener("keydown", keydownEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <ErrorBoundary>
            <SettingHeader />
            <Separator />
            <ScrollArea className="p-5 h-[80vh]">
                <BackupItems />
                <DangerItems />
            </ScrollArea>
        </ErrorBoundary>
    );
}
