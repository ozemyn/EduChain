package com.example.educhain.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;

/**
 * Redis管理工具类
 * 独立的Redis启动和停止管理
 */
public class RedisManager {

    private static final String REDIS_HOST = "localhost";
    private static final int REDIS_PORT = 6379;
    private static Process redisProcess;

    public static void main(String[] args) {
        System.out.println("=== Redis智能管理器 ===");
        
        // 如果没有参数，自动检查并启动Redis
        if (args.length == 0) {
            autoStartRedis();
            return;
        }

        String command = args[0].toLowerCase();
        
        switch (command) {
            case "start":
                startRedis();
                break;
            case "stop":
                stopRedis();
                break;
            case "restart":
                stopRedis();
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                startRedis();
                break;
            case "status":
                checkStatus();
                break;
            case "auto":
                autoStartRedis();
                break;
            default:
                printUsage();
        }
    }

    /**
     * 自动检查并启动Redis（默认行为）
     */
    public static void autoStartRedis() {
        System.out.println("🔍 自动检查Redis状态...");
        
        boolean wasRunning = isRedisRunning();
        
        if (wasRunning) {
            System.out.println("✅ Redis已在运行中！");
            System.out.println("📍 地址: " + REDIS_HOST + ":" + REDIS_PORT);
            
            // 显示Redis信息
            showRedisInfo();
            
            System.out.println("🎉 Redis准备就绪，可以启动你的应用了！");
        } else {
            System.out.println("❌ Redis未运行，正在自动启动...");
            startRedis();
            
            if (!isRedisRunning()) {
                System.out.println("❌ Redis启动失败，请检查安装或手动启动");
                System.exit(1);
                return;
            }
            
            System.out.println("🎉 Redis启动完成，可以启动你的应用了！");
        }
        
        // 显示交互式菜单
        showInteractiveMenu(wasRunning);
    }

    /**
     * 显示交互式菜单
     */
    private static void showInteractiveMenu(boolean wasAlreadyRunning) {
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        
        while (true) {
            System.out.println("\n" + "=".repeat(40));
            System.out.println("🎛️  Redis管理菜单");
            System.out.println("=".repeat(40));
            
            if (wasAlreadyRunning) {
                System.out.println("ℹ️  注意: Redis在程序启动前就已运行");
            }
            
            System.out.println("请选择操作:");
            System.out.println("  1️⃣  关闭Redis并退出");
            System.out.println("  2️⃣  保持Redis运行并退出");
            System.out.println("  3️⃣  查看Redis状态");
            System.out.println("  4️⃣  重启Redis");
            System.out.println("  0️⃣  显示帮助");
            System.out.println("=".repeat(40));
            System.out.print("👉 请输入选项 (1-4, 0): ");
            
            try {
                String input = scanner.nextLine().trim();
                
                switch (input) {
                    case "1":
                        System.out.println("\n🛑 正在关闭Redis...");
                        stopRedis();
                        System.out.println("👋 程序退出");
                        System.exit(0);
                        break;
                        
                    case "2":
                        System.out.println("\n✅ Redis将继续运行");
                        System.out.println("👋 程序退出");
                        System.exit(0);
                        break;
                        
                    case "3":
                        System.out.println("\n📊 Redis状态信息:");
                        checkStatus();
                        break;
                        
                    case "4":
                        System.out.println("\n🔄 重启Redis...");
                        stopRedis();
                        try {
                            Thread.sleep(2000);
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                        startRedis();
                        break;
                        
                    case "0":
                        showMenuHelp();
                        break;
                        
                    default:
                        System.out.println("❌ 无效选项，请输入 1-4 或 0");
                        break;
                }
                
            } catch (Exception e) {
                System.out.println("❌ 输入错误: " + e.getMessage());
            }
        }
    }

    /**
     * 显示菜单帮助
     */
    private static void showMenuHelp() {
        System.out.println("\n📖 菜单说明:");
        System.out.println("  选项1: 关闭Redis服务并退出程序");
        System.out.println("        - 适用于临时使用Redis的场景");
        System.out.println("        - 会完全停止Redis服务");
        System.out.println("");
        System.out.println("  选项2: 保持Redis运行并退出程序");
        System.out.println("        - 适用于需要Redis持续运行的场景");
        System.out.println("        - Redis会在后台继续运行");
        System.out.println("");
        System.out.println("  选项3: 查看当前Redis的详细状态");
        System.out.println("        - 显示版本、运行时间、内存使用等");
        System.out.println("");
        System.out.println("  选项4: 重启Redis服务");
        System.out.println("        - 先停止再启动Redis");
        System.out.println("        - 用于解决Redis异常问题");
    }

    /**
     * 启动Redis服务
     */
    public static void startRedis() {
        if (isRedisRunning()) {
            System.out.println("✅ Redis已在运行中 (" + REDIS_HOST + ":" + REDIS_PORT + ")");
            showRedisInfo();
            return;
        }

        System.out.println("🚀 正在启动Redis服务...");
        
        try {
            // macOS上启动Redis的几种方式
            redisProcess = startRedisMac();
            
            if (redisProcess != null) {
                System.out.print("⏳ 等待Redis启动");
                
                // 等待Redis启动完成
                boolean started = waitForRedisStart(30);
                System.out.println(); // 换行
                
                if (started) {
                    System.out.println("✅ Redis启动成功！");
                    System.out.println("📍 Redis地址: " + REDIS_HOST + ":" + REDIS_PORT);
                    if (redisProcess != null) {
                        System.out.println("🔧 进程ID: " + redisProcess.pid());
                    }
                    
                    // 显示Redis信息
                    showRedisInfo();
                    
                    // 添加关闭钩子
                    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                        System.out.println("\n🛑 检测到程序退出，保持Redis运行...");
                        // 注意：这里不自动关闭Redis，让它继续运行
                    }));
                    
                } else {
                    System.err.println("❌ Redis启动超时，请检查配置");
                }
            }
            
        } catch (Exception e) {
            System.err.println("❌ Redis启动失败: " + e.getMessage());
            System.err.println("💡 请尝试手动启动: brew services start redis");
        }
    }

    /**
     * 停止Redis服务
     */
    public static void stopRedis() {
        System.out.println("=== Redis停止管理器 ===");
        
        if (!isRedisRunning()) {
            System.out.println("ℹ️  Redis未在运行");
            return;
        }

        System.out.println("🛑 正在停止Redis服务...");
        stopRedisProcess();
        
        // 验证是否成功停止
        try {
            Thread.sleep(2000);
            if (!isRedisRunning()) {
                System.out.println("✅ Redis已成功停止");
            } else {
                System.out.println("⚠️  Redis可能仍在运行，请手动检查");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * 检查Redis状态
     */
    public static void checkStatus() {
        System.out.println("=== Redis状态检查 ===");
        
        if (isRedisRunning()) {
            System.out.println("✅ Redis正在运行");
            System.out.println("📍 地址: " + REDIS_HOST + ":" + REDIS_PORT);
            showRedisInfo();
        } else {
            System.out.println("❌ Redis未运行");
            System.out.println("💡 直接运行此程序可自动启动Redis");
        }
    }

    /**
     * 显示Redis详细信息
     */
    private static void showRedisInfo() {
        try {
            Process infoProcess = Runtime.getRuntime().exec("redis-cli info server");
            infoProcess.waitFor(3, TimeUnit.SECONDS);
            
            if (infoProcess.exitValue() == 0) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(infoProcess.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.startsWith("redis_version:")) {
                        System.out.println("📦 " + line);
                    } else if (line.startsWith("uptime_in_seconds:")) {
                        int uptime = Integer.parseInt(line.split(":")[1]);
                        System.out.println("⏰ 运行时间: " + formatUptime(uptime));
                    } else if (line.startsWith("used_memory_human:")) {
                        System.out.println("💾 内存使用: " + line.split(":")[1]);
                    }
                }
            }
            
            // 测试连接
            Process pingProcess = Runtime.getRuntime().exec("redis-cli ping");
            pingProcess.waitFor(2, TimeUnit.SECONDS);
            
            if (pingProcess.exitValue() == 0) {
                BufferedReader pingReader = new BufferedReader(new InputStreamReader(pingProcess.getInputStream()));
                String response = pingReader.readLine();
                if ("PONG".equals(response)) {
                    System.out.println("🏓 连接测试: 正常");
                }
            }
            
        } catch (Exception e) {
            System.out.println("⚠️  无法获取Redis详细信息: " + e.getMessage());
        }
    }

    /**
     * 格式化运行时间
     */
    private static String formatUptime(int seconds) {
        int days = seconds / 86400;
        int hours = (seconds % 86400) / 3600;
        int minutes = (seconds % 3600) / 60;
        
        if (days > 0) {
            return String.format("%d天 %d小时 %d分钟", days, hours, minutes);
        } else if (hours > 0) {
            return String.format("%d小时 %d分钟", hours, minutes);
        } else {
            return String.format("%d分钟", minutes);
        }
    }

    /**
     * 在macOS上启动Redis
     */
    private static Process startRedisMac() throws IOException {
        // 尝试多种启动方式
        String[] commands = {
            "redis-server",
            "/usr/local/bin/redis-server",
            "/opt/homebrew/bin/redis-server"
        };
        
        for (String command : commands) {
            try {
                System.out.println("🔄 尝试命令: " + command);
                Process process = Runtime.getRuntime().exec(command);
                
                // 等待一小段时间看是否启动成功
                Thread.sleep(1000);
                
                if (process.isAlive()) {
                    System.out.println("✅ 使用命令启动成功: " + command);
                    return process;
                }
            } catch (Exception e) {
                System.out.println("❌ 命令失败: " + command + " - " + e.getMessage());
            }
        }
        
        // 尝试使用brew services启动
        try {
            System.out.println("🔄 尝试使用Homebrew启动...");
            Process brewProcess = Runtime.getRuntime().exec("brew services start redis");
            brewProcess.waitFor(5, TimeUnit.SECONDS);
            
            if (brewProcess.exitValue() == 0) {
                System.out.println("✅ 使用Homebrew启动成功");
                return brewProcess;
            }
        } catch (Exception e) {
            System.out.println("❌ Homebrew启动失败: " + e.getMessage());
        }
        
        throw new IOException("无法启动Redis，请检查Redis是否已安装");
    }

    /**
     * 检查Redis是否正在运行
     */
    private static boolean isRedisRunning() {
        try {
            Process process = Runtime.getRuntime().exec("lsof -i :" + REDIS_PORT);
            process.waitFor(3, TimeUnit.SECONDS);
            
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = reader.readLine();
            return line != null && !line.trim().isEmpty();
            
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 等待Redis启动完成
     */
    private static boolean waitForRedisStart(int maxSeconds) {
        for (int i = 0; i < maxSeconds; i++) {
            if (isRedisRunning()) {
                return true;
            }
            
            try {
                Thread.sleep(1000);
                System.out.print(".");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return false;
            }
        }
        return false;
    }

    /**
     * 停止Redis进程
     */
    private static void stopRedisProcess() {
        try {
            if (redisProcess != null && redisProcess.isAlive()) {
                redisProcess.destroy();
                boolean terminated = redisProcess.waitFor(5, TimeUnit.SECONDS);
                
                if (!terminated) {
                    redisProcess.destroyForcibly();
                }
            }
            
            // 尝试使用系统命令停止
            try {
                Runtime.getRuntime().exec("brew services stop redis").waitFor(3, TimeUnit.SECONDS);
            } catch (Exception ignored) {}
            
            try {
                Runtime.getRuntime().exec("pkill -f redis-server").waitFor(3, TimeUnit.SECONDS);
            } catch (Exception ignored) {}
            
        } catch (Exception e) {
            System.err.println("停止Redis时出错: " + e.getMessage());
        }
    }

    /**
     * 打印使用说明
     */
    private static void printUsage() {
        System.out.println("=== Redis智能管理工具 ===");
        System.out.println("用法: java RedisManager [command]");
        System.out.println("");
        System.out.println("🎯 默认行为（无参数）:");
        System.out.println("  自动检查Redis状态，如果未运行则启动");
        System.out.println("");
        System.out.println("📋 可用命令:");
        System.out.println("  auto    - 自动检查并启动Redis（默认）");
        System.out.println("  start   - 强制启动Redis服务");
        System.out.println("  stop    - 停止Redis服务");
        System.out.println("  restart - 重启Redis服务");
        System.out.println("  status  - 检查Redis状态");
        System.out.println("");
        System.out.println("💡 推荐用法:");
        System.out.println("  直接运行: java RedisManager");
        System.out.println("  或在IDEA中点击运行按钮");
    }
}