**full step-by-step guide** to install and run **Minikube on Windows 11 (Home or Pro)** using the **Docker driver**, which is the most stable and recommended option.

---

## 🚀 Minikube Installation Guide (Windows 11)

### ✅ Prerequisites

1. **Windows 11 (Home or Pro)**  
2. **At least 8 GB RAM recommended**
3. **Admin privileges**

---

### 🧰 Step 1: Install Docker Desktop

1. **Download Docker Desktop**:  
   [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2. **Install it**  
   - Double-click the installer and follow the prompts.
   - Accept WSL 2 installation (required for Windows Home).
   - Restart your PC if prompted.

3. **Verify Docker is running**  
   Open **cmd** or **PowerShell** and type:

   ```bash
   docker version
   ```

   If Docker is working, you'll see version info.

---

### 🏗️ Step 2: Install Minikube

1. **Open PowerShell as Administrator**  
   (Right-click > Run as Administrator)

2. **Create a directory (optional):**
   ```powershell
   New-Item -Path 'A:\minikube' -ItemType Directory -Force
   ```

3. **Download Minikube binary:**
   ```powershell
   Invoke-WebRequest -OutFile 'A:\minikube\minikube.exe' `
     -Uri 'https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe' `
     -UseBasicParsing
   ```

4. **Add Minikube to PATH** (permanently):
   ```powershell
   setx PATH "$env:PATH;A:\minikube"
   ```

5. **Verify Minikube is installed:**
   ```powershell
   minikube version
   ```

---

### ⚙️ Step 3: Start Minikube with Docker

Now start Minikube using the Docker driver:

```powershell
minikube start --driver=docker
```

This will:
- Set up a local Kubernetes cluster
- Pull required images using Docker
- Start the cluster

You should see something like:

```
* minikube v1.35.0 on Windows 11
* Starting control plane node minikube in cluster minikube
* Pulling base image ...
* Preparing Kubernetes v1.29.1 ...
* Done! kubectl is now configured to use "minikube" cluster
```

---

### 🧪 Step 4: Verify the Setup

1. **Check the cluster status:**
   ```bash
   minikube status
   ```

2. **Check Kubernetes nodes:**
   ```bash
   kubectl get nodes
   ```

If `kubectl` isn't found, run:

```powershell
minikube kubectl -- get nodes
```

---

### 🧠 Useful Minikube Commands

| Command | Description |
|--------|-------------|
| `minikube dashboard` | Launch Kubernetes dashboard in browser |
| `minikube stop` | Stop the Minikube cluster |
| `minikube delete` | Delete the cluster completely |
| `minikube ssh` | SSH into the Minikube virtual machine |
| `minikube addons list` | Show available Minikube addons |

---

### 📌 Notes

- For Windows Home, Docker uses **WSL 2 backend**, so make sure WSL is enabled.
- Minikube supports other drivers like VirtualBox, but Docker is easiest and fastest.
- Make sure Docker Desktop is **running** before starting Minikube.

---
