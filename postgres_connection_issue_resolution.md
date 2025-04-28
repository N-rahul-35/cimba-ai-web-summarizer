Sure! Below is the updated version of your Markdown document with a navigable table of contents at the top for easy access:


# PostgreSQL Connection Issue - Resolution Guide

## **Table of Contents**
1. [Issue Summary](#issue-summary)
2. [Steps to Resolve the Issues](#steps-to-resolve-the-issues)
    - [Verify PostgreSQL Service is Running](#verify-postgresql-service-is-running)
    - [Verify PostgreSQL Listening on Port 5432](#verify-postgresql-listening-on-port-5432)
    - [Update JDBC URL with Correct Port](#update-jdbc-url-with-correct-port)
    - [Update `postgresql.conf` File for External Connections](#update-postgresqlconf-file-for-external-connections)
    - [Modify `pg_hba.conf` to Allow Remote Connections](#modify-pghbaconf-to-allow-remote-connections)
    - [Restart PostgreSQL Service](#restart-postgresql-service)
    - [Verify JDBC Driver Inclusion](#verify-jdbc-driver-inclusion)
    - [Test the Database Connection](#test-the-database-connection)
3. [Conclusion](#conclusion)
4. [Key Takeaways](#key-takeaways)

---

## **Issue Summary**

When attempting to connect to PostgreSQL using Java, two main issues occurred:

1. **No suitable driver found** for the JDBC connection.
2. **Connection to localhost:5432 refused** due to PostgreSQL not being properly configured to accept TCP/IP connections.

---

## **Steps to Resolve the Issues**

### **1. Verify PostgreSQL Service is Running**

First, ensure that PostgreSQL is running on your system. You can use the following PowerShell command to check the status of the PostgreSQL service:

```powershell
Get-Service | Where-Object { $_.DisplayName -like "*PostgreSQL*" }
```

#### Expected Output:
```
Status   Name               DisplayName
------   ----               -----------
Running  postgresql-x64-17  postgresql-x64-17
```

This confirms that the PostgreSQL service is running.

---

### **2. Verify PostgreSQL Listening on Port 5432**

PostgreSQL should be listening on port `5432` (default port for PostgreSQL). Use the following command to check if PostgreSQL is listening on the correct port:

```powershell
netstat -ano | findstr 5432
```

#### Expected Output:
```
  TCP    0.0.0.0:5432           0.0.0.0:0              LISTENING       17356
  TCP    [::]:5432              [::]:0                 LISTENING       17356
```

This confirms that PostgreSQL is correctly listening on port `5432`.

---

### **3. Update JDBC URL with Correct Port**

The initial error occurred because the JDBC URL was using port `8080`, which is not correct for PostgreSQL. The correct port is `5432`.

- **Incorrect JDBC URL**: `jdbc:postgresql://localhost:8080/websummarizer`
- **Correct JDBC URL**: `jdbc:postgresql://localhost:5432/websummarizer`

Make sure to update the connection URL in your Java code to use port `5432` as shown above.

---

### **4. Update `postgresql.conf` File for External Connections**

To allow connections from outside `localhost`, you need to configure PostgreSQL to accept TCP/IP connections. Open the `postgresql.conf` file and update the following line:

- Find the line:
  ```
  #listen_addresses = 'localhost'
  ```
- Update it to:
  ```bash
  listen_addresses = '*'
  ```
This allows PostgreSQL to accept connections from any IP address.

---

### **5. Modify `pg_hba.conf` to Allow Remote Connections**

Next, you need to update the `pg_hba.conf` file to allow TCP/IP connections. Add or update the following lines:

```bash
# Allow local connections
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256

# Allow remote connections (if necessary)
host    all             all             0.0.0.0/0               scram-sha-256
```

This allows connections from any IP address (`0.0.0.0/0`). If you want to restrict connections to specific IPs, replace `0.0.0.0/0` with the appropriate range.

---

### **6. Restart PostgreSQL Service**

After making changes to the configuration files, you need to restart PostgreSQL for the changes to take effect. You can restart the PostgreSQL service with the following command in PowerShell:

```powershell
Restart-Service postgresql-x64-17
```

---

### **7. Verify JDBC Driver Inclusion**

Ensure that the PostgreSQL JDBC driver is properly included in the classpath. When compiling and running your Java code, include the path to the JDBC driver `.jar` file.

For example, compile and run the Java program with the following commands:

```bash
javac TestConnection.java
java -cp ".;backend/libs/postgresql-42.7.4.jar" TestConnection
```

---

### **8. Test the Database Connection**

After completing the above steps, try running the Java program again to check if the connection is successful:

```bash
java -cp ".;backend/libs/postgresql-42.7.4.jar" TestConnection
```

#### Expected Output:
```
Connected to the database!
```

---

## **Conclusion**

The issue was caused by two main factors:
1. **Incorrect JDBC URL**: The URL used port `8080`, which is not for PostgreSQL. The correct port is `5432`.
2. **PostgreSQL Configuration**: PostgreSQL was not configured to allow connections via TCP/IP from external sources.

After making the necessary configuration changes and ensuring the correct JDBC URL, the connection was successfully established.

---

## **Key Takeaways**

- Always verify that PostgreSQL is running and listening on the correct port (`5432` by default).
- Ensure that the JDBC driver is included in the Java classpath.
- Update the `postgresql.conf` and `pg_hba.conf` files to allow external connections.
- Restart the PostgreSQL service after making configuration changes.

By following these steps, you can resolve the connection issue and successfully connect to the PostgreSQL database.

